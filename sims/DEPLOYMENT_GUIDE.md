# SIMS Deployment Guide

Guide for deploying the Stock Inventory Management System to production.

---

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backup created
- [ ] SSL certificate obtained
- [ ] Domain name registered
- [ ] Production server prepared
- [ ] Security headers configured
- [ ] Database optimized
- [ ] Static files minified
- [ ] Performance tested
- [ ] Security audit completed

---

## Backend Deployment

### 1. Production Environment Setup

Create `.env.production`:
```
DB_HOST=your-prod-db-host
DB_USER=prod_user
DB_PASSWORD=strong_password_123
DB_NAME=sims_db_prod
SESSION_SECRET=generate_strong_random_key_here
PORT=5000
NODE_ENV=production
```

### 2. Install PM2 (Process Manager)

```bash
npm install -g pm2

# Start application
pm2 start server.js --name "SIMS-Backend"

# Save PM2 config
pm2 save

# Auto-restart on reboot
pm2 startup
```

### 3. Nginx Reverse Proxy

Configure Nginx to forward requests to Node.js:

```nginx
# /etc/nginx/sites-available/sims-backend
upstream backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy settings
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/sims-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Database Setup

```bash
# Connect to production database
mysql -h prod-db-host -u root -p

# Create user
CREATE USER 'prod_user'@'localhost' IDENTIFIED BY 'strong_password_123';
GRANT ALL PRIVILEGES ON sims_db_prod.* TO 'prod_user'@'localhost';

# Import schema
mysql -u prod_user -p sims_db_prod < database.sql
```

### 5. Security Measures

Update `server.js` for production:

```javascript
// Enable HTTPS
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,  // HTTPS only
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// CORS - Restrict to frontend domain
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## Frontend Deployment

### 1. Build for Production

```bash
cd frontend-project

# Build optimized bundle
npm run build

# Output: dist/ folder with optimized files
```

### 2. Configure API Endpoint

Create `.env.production` in frontend-project:
```
VITE_API_URL=https://api.yourdomain.com/api
```

Update `src/api/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

Rebuild:
```bash
npm run build
```

### 3. Deploy to Web Server

#### Option A: Nginx Static Hosting

```nginx
# /etc/nginx/sites-available/sims-frontend
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    root /var/www/sims/dist;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # SPA Routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript 
               application/javascript application/json;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

#### Option B: Vercel/Netlify

1. Connect repository to Vercel/Netlify
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

### 4. CDN Configuration (Optional)

Use Cloudflare or similar:
- Automatic HTTPS
- Global caching
- DDoS protection
- Performance optimization

---

## Database Optimization

### 1. Add Indexes (Already in schema)

```sql
CREATE INDEX idx_spare_part_category ON spare_part(category);
CREATE INDEX idx_stock_in_sparepart ON stock_in(sparePartId);
CREATE INDEX idx_stock_in_date ON stock_in(stockInDate);
CREATE INDEX idx_stock_out_sparepart ON stock_out(sparePartId);
CREATE INDEX idx_stock_out_user ON stock_out(userId);
CREATE INDEX idx_stock_out_date ON stock_out(stockOutDate);
```

### 2. Regular Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h localhost -u prod_user -p sims_db_prod > /backups/sims_$DATE.sql
```

Add to crontab:
```
0 2 * * * /path/to/backup-script.sh
```

### 3. Database Maintenance

```bash
# Optimize tables
mysql -u prod_user -p sims_db_prod -e "OPTIMIZE TABLE users, spare_part, stock_in, stock_out;"

# Check database integrity
mysql -u prod_user -p sims_db_prod -e "CHECK TABLE users, spare_part, stock_in, stock_out;"
```

---

## Monitoring & Logging

### 1. PM2 Monitoring

```bash
# View logs
pm2 logs SIMS-Backend

# Monitor resources
pm2 monit

# Create ecosystem.config.js
module.exports = {
  apps: [{
    name: 'SIMS-Backend',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log'
  }]
};

# Start with config
pm2 start ecosystem.config.js
```

### 2. Application Logging

Add Winston logger to `server.js`:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
```

### 3. Error Tracking (Sentry)

```javascript
const Sentry = require("@sentry/node");

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## Performance Optimization

### 1. Frontend

```bash
# Check bundle size
npm run build
# Use webpack-bundle-analyzer

# Optimize images
# Use tools like ImageOptim or TinyPNG

# Lazy load routes
# Already configured in React Router
```

### 2. Backend

```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Connection pooling (already configured)
// Query optimization with indexes

// Cache frequently accessed data
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });
```

### 3. Database

```sql
-- Query statistics
ANALYZE TABLE spare_part, stock_in, stock_out;

-- View performance
SHOW PROFILES;
```

---

## SSL/TLS Certificate

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Rollback Procedure

### If Deployment Fails

```bash
# Backend rollback
cd backend-project
git checkout previous-commit
npm install
pm2 restart SIMS-Backend

# Frontend rollback
# Revert to previous deployment on Vercel/Netlify
# Or restore previous dist/ from backup
```

---

## Performance Benchmarks

**Target Metrics:**
- API Response Time: < 200ms
- Page Load Time: < 3s
- Database Query Time: < 100ms
- Uptime: > 99.9%

**Monitor with:**
- New Relic
- DataDog
- AWS CloudWatch
- Google Analytics

---

## Scaling Strategies

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Upgrade database server

### Horizontal Scaling
- Load balancer (HAProxy, Nginx)
- Multiple backend instances
- Database replication
- Redis caching layer

---

## Security Hardening

### Firewall Rules
```bash
# Allow only necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### SSH Configuration
```bash
# Disable root login
# Disable password authentication
# Use SSH keys only
```

### Database Security
```sql
-- Remove unnecessary users
DROP USER 'root'@'%';

-- Create limited user
CREATE USER 'app_user'@'%' IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON sims_db_prod.* TO 'app_user'@'%';
```

---

## Troubleshooting

### Application won't start
```bash
pm2 logs SIMS-Backend
# Check error logs
```

### Database connection timeout
```bash
# Check MySQL is running
# Verify credentials in .env
# Check firewall rules
```

### High memory usage
```bash
pm2 monit
# Check for memory leaks
# Increase max_memory_restart in PM2 config
```

---

## Support & Documentation

- PM2 Docs: https://pm2.keymetrics.io/
- Nginx Docs: https://nginx.org/
- Let's Encrypt: https://letsencrypt.org/
- MySQL Docs: https://dev.mysql.com/

---

**Last Updated:** 2024-01-25
**Maintained By:** Development Team
