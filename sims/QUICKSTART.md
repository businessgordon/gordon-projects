# SIMS - Quick Start Guide

## Prerequisites
- Node.js v14+ and npm
- MySQL Server (running)
- A code editor (VS Code recommended)

## Installation Steps

### 1. Database Setup (One-time)
```bash
# Open MySQL Command Line or MySQL Workbench and run:
mysql -u root -p < backend-project/database.sql

# Or manually:
# 1. Open MySQL
# 2. Copy and paste all SQL from backend-project/database.sql
# 3. Execute all queries
```

### 2. Backend Installation
```bash
cd backend-project

# Install dependencies
npm install

# Start the server (will run on http://localhost:5000)
npm run dev
```

**Backend Ready:** Your backend should now be running! Look for "SIMS Backend Server running on http://localhost:5000"

### 3. Frontend Installation (New Terminal/Command Prompt)
```bash
cd frontend-project

# Install dependencies
npm install

# Start the development server (will run on http://localhost:5173)
npm run dev
```

**Frontend Ready:** Your frontend will open automatically or go to http://localhost:5173

## Login to Application

1. Open http://localhost:5173
2. Use these credentials:
   - **Username:** admin
   - **Password:** password123

## What You Can Do

### Dashboard
- View statistics and recent activities
- See total spare parts, stock in/out counts
- Monitor remaining inventory

### Spare Parts
- ➕ Add new spare parts
- 📝 Edit existing parts
- 🗑️ Delete parts
- 🔍 Search parts

### Stock In
- ➕ Add incoming stock
- 📋 View stock history
- Automatic quantity updates

### Stock Out
- ➕ Add outgoing stock
- 📝 Edit records
- 🗑️ Delete records
- Track who removed stock

### Reports
- 📊 Daily stock out report
- 📦 Stock status report
- 🖨️ Print reports
- 📅 Filter by date

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# If in use, change PORT in .env to 5001, 5002, etc.
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run dev
```

### MySQL Connection Failed
```bash
# Check MySQL is running
# Update .env with correct credentials:
# DB_HOST=localhost (or 127.0.0.1)
# DB_USER=root (your username)
# DB_PASSWORD= (your password)
# DB_NAME=sims_db
```

### "Cannot POST /api/users/login"
- Ensure backend is running on port 5000
- Check that both servers are running
- Verify .env configuration

## Production Build

### Frontend Build
```bash
cd frontend-project
npm run build
# Creates 'dist' folder with optimized files
```

### Backend Deployment
- Set NODE_ENV=production
- Use a process manager like PM2
- Enable HTTPS (secure: true in session config)

## Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health | http://localhost:5000/api/health |

## File Structure

```
backend-project/
├── server.js          ← Main server file
├── .env              ← Configuration
├── database.sql      ← Database setup
└── routes/           ← API endpoints

frontend-project/
├── src/
│   ├── App.jsx       ← Main component
│   ├── pages/        ← Page components
│   ├── components/   ← Reusable components
│   └── api/          ← API calls
└── index.html        ← Entry point
```

## Development Tips

- Check browser console for frontend errors (F12)
- Check terminal for backend errors
- Use "Inspect" to debug UI elements
- Test with different screen sizes (responsive design)

## Need Help?

1. Check the main README.md
2. Review code comments
3. Check console/terminal for error messages
4. Verify all prerequisites are installed

Enjoy using SIMS! 🚀
