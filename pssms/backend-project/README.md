# PSSMS Backend

This backend provides REST endpoints for cars, parking slots, parking records, payments, and reports.

## Setup

1. Copy `.env.example` to `.env`.
2. Set your MySQL credentials and database name.
3. Run `npm install`.
4. Run the SQL script in `../database/init.sql` against your MySQL server.
5. Start the backend with `npm run dev`.

## Default login

On first startup, a default admin user is created automatically if none exists.

- Username: `admin`
- Password: `Gordon@123`

## API endpoints

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/cars`
- `POST /api/cars`
- `GET /api/slots`
- `POST /api/slots`
- `GET /api/records`
- `POST /api/records`
- `PUT /api/records/:id`
- `DELETE /api/records/:id`
- `GET /api/payments`
- `POST /api/payments`
- `GET /api/reports/daily`
- `GET /api/reports/bill/:id`
