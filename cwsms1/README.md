# Car Washing Sales Management System (CWSMS)

A complete full-stack management application for car washing sales, including a modern React dashboard frontend and a Node.js + Express backend with JWT authentication.

## Project Structure

- `backend-project/` – Express API, MySQL integration, authentication, and REST endpoints.
- `frontend-project/` – React + Tailwind dashboard UI with authentication and management pages.
- `CWSMS.sql` – Database schema and sample package data.

## Installation

1. Install backend dependencies:
   ```bash
   cd backend-project
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd ../frontend-project
   npm install
   ```

3. Create the database:
   - Import `CWSMS.sql` into MySQL.
   - Or run: `mysql -u root -p < CWSMS.sql`

4. Configure environment variables:
   - Copy `backend-project/.env.example` to `backend-project/.env`
   - Add MySQL credentials and JWT secret.

## Running the app

- Start backend:
  ```bash
  cd backend-project
  npm run dev
  ```

- Start frontend:
  ```bash
  cd frontend-project
  npm run dev
  ```

## Default API Documentation

- `POST /api/auth/register` – register new admin user
- `POST /api/auth/login` – login and receive JWT
- Protected routes require `Authorization: Bearer <token>`
- `GET /api/cars`
- `POST /api/cars`
- `PUT /api/cars/:plate_number`
- `DELETE /api/cars/:plate_number`
- `GET /api/packages`
- `POST /api/packages`
- `PUT /api/packages/:package_number`
- `DELETE /api/packages/:package_number`
- `GET /api/services`
- `POST /api/services`
- `PUT /api/services/:record_number`
- `DELETE /api/services/:record_number`
- `GET /api/payments`
- `POST /api/payments`
- `PUT /api/payments/:payment_number`
- `GET /api/reports/daily`
- `GET /api/reports/summary?period=monthly`
- `GET /api/reports/stats`

## ERD Diagram

Users
  • user_id PK
  • username
  • email
  • password
  • role
  • created_at

Cars
  • plate_number PK
  • car_type
  • car_size
  • driver_name
  • phone_number
  • created_at

Packages
  • package_number PK
  • package_name
  • package_description
  • package_price

ServicePackage
  • record_number PK
  • plate_number FK → Cars.plate_number
  • package_number FK → Packages.package_number
  • service_date
  • status

Payment
  • payment_number PK
  • record_number FK → ServicePackage.record_number
  • amount_paid
  • payment_date
  • payment_method
  • payment_status

## Notes

- Frontend runs on Vite and connects to backend at `http://localhost:5000/api`
- Backend uses JWT and bcrypt password hashing
- MySQL schema is available in `CWSMS.sql`
