# CWSMS Backend

This is the backend API for the Car Washing Sales Management System (CWSMS).

## Setup

1. Copy `.env.example` to `.env` and set your MySQL credentials.
2. Run `npm install`.
3. Create the database using `CWSMS.sql`.
4. Start the server with `npm run dev`.

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
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
- `GET /api/reports/summary`
- `GET /api/reports/stats`
