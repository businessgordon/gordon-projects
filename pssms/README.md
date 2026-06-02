# Gordon Andy - Parking Space Sales Management System (PSSMS)

Project created for SmartPark's parking space sales management. This repository contains a backend Express API and a React frontend app.

## Structure

- `backend-project/` - Node.js Express backend with MySQL support
- `frontend-project/` - React + Vite + Tailwind frontend app
- `database/init.sql` - MySQL database schema for PSSMS

## Notes

- Default admin credentials are created on backend startup when no user exists.
- Use `http://localhost:5173` for the frontend and `http://localhost:4000` for the backend.
- Parking fee is calculated hourly at `500 Rwf` per hour.
