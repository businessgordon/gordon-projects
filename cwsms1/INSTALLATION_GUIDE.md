# CWSMS Installation Guide

## Prerequisites

- Node.js v16+ and npm
- MySQL 5.7+
- Git (optional)

## Steps

### 1. Database Setup

```bash
mysql -u root -p
CREATE DATABASE IF NOT EXISTS CWSMS;
USE CWSMS;
-- Import the schema from CWSMS.sql
mysql -u root -p CWSMS < CWSMS.sql
```

### 2. Backend Setup

```bash
cd backend-project
npm install
cp .env.example .env
```

Update `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=CWSMS
JWT_SECRET=your_secret_key
PORT=5000
```

Start backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend-project
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## First Time Setup

1. Navigate to `http://localhost:5173/register`
2. Create your admin user account
3. Login and start using the dashboard

## Default Packages

The system comes with 3 pre-configured packages:
- Basic Wash: ₦5,000
- Classic Wash: ₦10,000
- Premium Wash: ₦20,000

## Troubleshooting

- If database connection fails, verify MySQL is running and credentials are correct
- If frontend can't connect to API, ensure backend is running on port 5000
- Check browser console for any CORS or network errors

For more details, see `README.md` in the root directory.
