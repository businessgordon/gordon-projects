# CWSMS API Documentation

## Authentication

### Register
**Endpoint:** `POST /api/auth/register`

Request body:
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "securepassword",
  "role": "admin"
}
```

Response:
```json
{
  "user": {"id": 1, "username": "admin", "email": "admin@example.com", "role": "admin"},
  "token": "eyJhbGc..."
}
```

### Login
**Endpoint:** `POST /api/auth/login`

Request body:
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "user": {"id": 1, "username": "admin", "email": "admin@example.com", "role": "admin"},
  "token": "eyJhbGc..."
}
```

---

## Cars

### Get All Cars
**Endpoint:** `GET /api/cars?search=&page=1&limit=10`

**Headers:** `Authorization: Bearer <token>`

Response:
```json
{
  "rows": [
    {
      "plate_number": "ABC123",
      "car_type": "Sedan",
      "car_size": "Medium",
      "driver_name": "John Doe",
      "phone_number": "08012345678",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

### Create Car
**Endpoint:** `POST /api/cars`

**Headers:** `Authorization: Bearer <token>`

Request body:
```json
{
  "plate_number": "ABC123",
  "car_type": "Sedan",
  "car_size": "Medium",
  "driver_name": "John Doe",
  "phone_number": "08012345678"
}
```

Response:
```json
{
  "message": "Car created"
}
```

### Update Car
**Endpoint:** `PUT /api/cars/:plate_number`

**Headers:** `Authorization: Bearer <token>`

Request body: Same as Create Car

### Delete Car
**Endpoint:** `DELETE /api/cars/:plate_number`

**Headers:** `Authorization: Bearer <token>`

---

## Packages

### Get All Packages
**Endpoint:** `GET /api/packages?search=`

**Headers:** `Authorization: Bearer <token>`

Response:
```json
[
  {
    "package_number": 1,
    "package_name": "Basic Wash",
    "package_description": "Exterior hand wash",
    "package_price": "5000.00"
  }
]
```

### Create Package
**Endpoint:** `POST /api/packages`

**Headers:** `Authorization: Bearer <token>`

Request body:
```json
{
  "package_name": "Deluxe Wash",
  "package_description": "Full interior and exterior detailing",
  "package_price": 25000
}
```

### Update Package
**Endpoint:** `PUT /api/packages/:package_number`

**Headers:** `Authorization: Bearer <token>`

Request body: Same as Create

### Delete Package
**Endpoint:** `DELETE /api/packages/:package_number`

**Headers:** `Authorization: Bearer <token>`

---

## Service Packages

### Get All Services
**Endpoint:** `GET /api/services?search=&page=1&limit=10`

**Headers:** `Authorization: Bearer <token>`

Response:
```json
{
  "rows": [
    {
      "record_number": 1,
      "plate_number": "ABC123",
      "package_number": 1,
      "service_date": "2024-01-01T10:00:00Z",
      "status": "Pending",
      "car_type": "Sedan",
      "driver_name": "John Doe",
      "package_name": "Basic Wash",
      "package_price": "5000.00"
    }
  ],
  "total": 1
}
```

### Create Service
**Endpoint:** `POST /api/services`

**Headers:** `Authorization: Bearer <token>`

Request body:
```json
{
  "plate_number": "ABC123",
  "package_number": 1,
  "service_date": "2024-01-01T10:00:00",
  "status": "Pending"
}
```

Response:
```json
{
  "message": "Service created",
  "record_number": 1
}
```

### Update Service
**Endpoint:** `PUT /api/services/:record_number`

**Headers:** `Authorization: Bearer <token>`

Request body: Same as Create

### Delete Service
**Endpoint:** `DELETE /api/services/:record_number`

**Headers:** `Authorization: Bearer <token>`

---

## Payments

### Get All Payments
**Endpoint:** `GET /api/payments?search=&page=1&limit=10&startDate=&endDate=`

**Headers:** `Authorization: Bearer <token>`

Response:
```json
{
  "rows": [
    {
      "payment_number": 1,
      "record_number": 1,
      "amount_paid": "5000.00",
      "payment_date": "2024-01-01T10:30:00Z",
      "payment_method": "cash",
      "payment_status": "Paid",
      "driver_name": "John Doe",
      "plate_number": "ABC123"
    }
  ],
  "total": 1
}
```

### Create Payment
**Endpoint:** `POST /api/payments`

**Headers:** `Authorization: Bearer <token>`

Request body:
```json
{
  "record_number": 1,
  "amount_paid": 5000,
  "payment_date": "2024-01-01T10:30:00",
  "payment_method": "cash",
  "payment_status": "Paid"
}
```

Response:
```json
{
  "message": "Payment recorded",
  "payment_number": 1
}
```

### Update Payment
**Endpoint:** `PUT /api/payments/:payment_number`

**Headers:** `Authorization: Bearer <token>`

Request body: Same as Create (excluding record_number)

---

## Reports

### Daily Report
**Endpoint:** `GET /api/reports/daily`

**Headers:** `Authorization: Bearer <token>`

Response:
```json
[
  {
    "record_number": 1,
    "plate_number": "ABC123",
    "package_name": "Basic Wash",
    "package_description": "Exterior hand wash",
    "amount_paid": "5000.00",
    "payment_date": "2024-01-01T10:30:00Z"
  }
]
```

### Summary Report
**Endpoint:** `GET /api/reports/summary?period=monthly`

**Headers:** `Authorization: Bearer <token>`

Period values: `daily`, `weekly`, `monthly`

Response:
```json
[
  {
    "label": "2024-01-01",
    "revenue": "15000.00",
    "transactions": 3
  }
]
```

### Statistics
**Endpoint:** `GET /api/reports/stats`

**Headers:** `Authorization: Bearer <token>`

Response:
```json
{
  "totalCars": 10,
  "pendingPayments": 2,
  "completedWashes": 8,
  "todayWashes": 3,
  "totalRevenue": "150000.00",
  "topPackages": [
    {
      "package_name": "Basic Wash",
      "sold": 5
    }
  ]
}
```

---

## Error Responses

All errors return appropriate HTTP status codes with message:

```json
{
  "message": "Error description"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
