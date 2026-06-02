# SmartPark Employee Payroll Management System (EPMS)

This repository contains a full-stack Employee Payroll Management System built for SmartPark in Rubavu District, Rwanda.

## Technologies
- Frontend: React.js, Tailwind CSS, Axios
- Backend: Node.js, Express.js
- Database: MySQL
- Authentication: Session-based login with bcrypt password hashing

## Structure
- `backend-project/` - Node.js backend with RESTful APIs and session authentication
- `frontend-project/` - React.js frontend with protected routes and Tailwind styling

## Setup Instructions
1. Create MySQL database and import `epms-schema.sql`.
2. Copy `backend-project/.env.example` to `backend-project/.env` and update credentials.
3. Install backend dependencies in `backend-project/`:
   - `npm install`
4. Install frontend dependencies in `frontend-project/`:
   - `npm install`
5. Start backend server:
   - `npm run dev` from `backend-project/`
6. Start frontend app:
   - `npm run dev` from `frontend-project/`

## Built Features
- Login and logout with session handling
- Employee, Department, Salary CRUD support
- Monthly payroll report
- Duplicate prevention and validation
- Tailwind UI with responsive dashboard and tables
- Axios API communication
