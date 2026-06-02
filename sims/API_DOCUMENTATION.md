# SIMS API Documentation

Base URL: `http://localhost:5000/api`

All endpoints require authentication except for `/users/register` and `/users/login`.

---

## Authentication Endpoints

### 1. Register New User
**POST** `/users/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "userId": 2
}
```

**Error (409 Conflict):**
```json
{
  "message": "Username already exists"
}
```

---

### 2. Login User
**POST** `/users/login`

Authenticate user and create session.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "userId": 1,
    "username": "admin"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Invalid username or password"
}
```

---

### 3. Logout User
**POST** `/users/logout`

Destroy user session.

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

### 4. Get Current User
**GET** `/users/me`

Get authenticated user information.

**Headers:**
- Session cookie must be set

**Response (200 OK):**
```json
{
  "user": {
    "userId": 1,
    "username": "admin"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Not authenticated"
}
```

---

## Spare Parts Endpoints

### 1. Create Spare Part
**POST** `/spareparts`

Add a new spare part to inventory.

**Request Body:**
```json
{
  "name": "Engine Oil",
  "category": "Fluids",
  "quantity": 100,
  "unitPrice": 25.50
}
```

**Response (201 Created):**
```json
{
  "message": "Spare part created successfully",
  "sparePartId": 5
}
```

**Error (409 Conflict):**
```json
{
  "message": "Spare part already exists"
}
```

---

### 2. Get All Spare Parts
**GET** `/spareparts`

Retrieve all spare parts.

**Response (200 OK):**
```json
[
  {
    "sparePartId": 1,
    "name": "Engine Oil Filter",
    "category": "Filters",
    "quantity": 45,
    "unitPrice": 15.99,
    "totalPrice": 719.55,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "sparePartId": 2,
    "name": "Air Filter",
    "category": "Filters",
    "quantity": 32,
    "unitPrice": 12.50,
    "totalPrice": 400.00,
    "createdAt": "2024-01-15T10:31:00Z"
  }
]
```

---

### 3. Get Spare Part by ID
**GET** `/spareparts/:id`

Get specific spare part details.

**URL Parameters:**
- `id` (required): Spare part ID

**Response (200 OK):**
```json
{
  "sparePartId": 1,
  "name": "Engine Oil Filter",
  "category": "Filters",
  "quantity": 45,
  "unitPrice": 15.99,
  "totalPrice": 719.55,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error (404 Not Found):**
```json
{
  "message": "Spare part not found"
}
```

---

### 4. Update Spare Part
**PUT** `/spareparts/:id`

Update spare part information.

**URL Parameters:**
- `id` (required): Spare part ID

**Request Body:**
```json
{
  "name": "Premium Engine Oil Filter",
  "category": "Filters",
  "quantity": 50,
  "unitPrice": 17.99
}
```

**Response (200 OK):**
```json
{
  "message": "Spare part updated successfully"
}
```

---

### 5. Delete Spare Part
**DELETE** `/spareparts/:id`

Remove spare part from inventory.

**URL Parameters:**
- `id` (required): Spare part ID

**Response (200 OK):**
```json
{
  "message": "Spare part deleted successfully"
}
```

---

## Stock In Endpoints

### 1. Create Stock In Record
**POST** `/stockin`

Record incoming stock.

**Request Body:**
```json
{
  "sparePartId": 1,
  "stockInQuantity": 50,
  "stockInDate": "2024-01-20"
}
```

**Response (201 Created):**
```json
{
  "message": "Stock in record created successfully",
  "stockInId": 12
}
```

**Note:** Spare part quantity is automatically updated.

---

### 2. Get All Stock In Records
**GET** `/stockin`

Retrieve all stock in records.

**Response (200 OK):**
```json
[
  {
    "stockInId": 1,
    "sparePartId": 1,
    "name": "Engine Oil Filter",
    "category": "Filters",
    "stockInQuantity": 50,
    "unitPrice": 15.99,
    "totalPrice": 799.50,
    "stockInDate": "2024-01-20"
  },
  {
    "stockInId": 2,
    "sparePartId": 2,
    "name": "Air Filter",
    "category": "Filters",
    "stockInQuantity": 30,
    "unitPrice": 12.50,
    "totalPrice": 375.00,
    "stockInDate": "2024-01-20"
  }
]
```

---

### 3. Get Stock In by ID
**GET** `/stockin/:id`

Get specific stock in record.

**Response (200 OK):**
```json
{
  "stockInId": 1,
  "sparePartId": 1,
  "name": "Engine Oil Filter",
  "category": "Filters",
  "stockInQuantity": 50,
  "unitPrice": 15.99,
  "totalPrice": 799.50,
  "stockInDate": "2024-01-20"
}
```

---

## Stock Out Endpoints

### 1. Create Stock Out Record
**POST** `/stockout`

Record outgoing stock.

**Request Body:**
```json
{
  "sparePartId": 1,
  "stockOutQuantity": 10,
  "stockOutUnitPrice": 15.99,
  "stockOutDate": "2024-01-21"
}
```

**Response (201 Created):**
```json
{
  "message": "Stock out record created successfully",
  "stockOutId": 15
}
```

**Error (400 Bad Request):**
```json
{
  "message": "Insufficient quantity in stock"
}
```

**Note:** 
- User ID is taken from session
- Spare part quantity is automatically decremented
- Total price is calculated: quantity × unitPrice

---

### 2. Get All Stock Out Records
**GET** `/stockout`

Retrieve all stock out records.

**Response (200 OK):**
```json
[
  {
    "stockOutId": 1,
    "sparePartId": 1,
    "name": "Engine Oil Filter",
    "category": "Filters",
    "stockOutQuantity": 10,
    "stockOutUnitPrice": 15.99,
    "stockOutTotalPrice": 159.90,
    "stockOutDate": "2024-01-21",
    "userId": 1,
    "username": "admin"
  },
  {
    "stockOutId": 2,
    "sparePartId": 2,
    "name": "Air Filter",
    "category": "Filters",
    "stockOutQuantity": 5,
    "stockOutUnitPrice": 12.50,
    "stockOutTotalPrice": 62.50,
    "stockOutDate": "2024-01-21",
    "userId": 1,
    "username": "admin"
  }
]
```

---

### 3. Get Stock Out by ID
**GET** `/stockout/:id`

Get specific stock out record.

**Response (200 OK):**
```json
{
  "stockOutId": 1,
  "sparePartId": 1,
  "name": "Engine Oil Filter",
  "category": "Filters",
  "stockOutQuantity": 10,
  "stockOutUnitPrice": 15.99,
  "stockOutTotalPrice": 159.90,
  "stockOutDate": "2024-01-21",
  "userId": 1,
  "username": "admin"
}
```

---

### 4. Update Stock Out Record
**PUT** `/stockout/:id`

Modify stock out record.

**Request Body:**
```json
{
  "sparePartId": 1,
  "stockOutQuantity": 15,
  "stockOutUnitPrice": 15.99,
  "stockOutDate": "2024-01-21"
}
```

**Response (200 OK):**
```json
{
  "message": "Stock out record updated successfully"
}
```

**Note:** Spare part quantity is adjusted based on the difference.

---

### 5. Delete Stock Out Record
**DELETE** `/stockout/:id`

Remove stock out record.

**Response (200 OK):**
```json
{
  "message": "Stock out record deleted successfully"
}
```

**Note:** Quantity is added back to spare part inventory.

---

## Health Check

### Check API Status
**GET** `/health`

Verify API is running.

**Response (200 OK):**
```json
{
  "message": "Server is running"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authenticated"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "message": "Duplicate entry"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Query Parameters

### Filtering by Date
```
GET /stockout?date=2024-01-21
```

### Pagination (Future Enhancement)
```
GET /spareparts?page=1&limit=10
```

---

## Response Headers

All responses include:
- `Content-Type: application/json`
- `CORS-Enabled: Access-Control-Allow-Origin: http://localhost:5173`

---

## Session Management

- Session stored server-side
- Session ID in HTTP-only cookie
- Session expires after 24 hours of inactivity
- Auto-login after page refresh if session valid

---

## Rate Limiting (Future Enhancement)

Suggested limits:
- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## Pagination (Future Enhancement)

Suggested format:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","confirmPassword":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username":"admin","password":"password123"}'
```

### Get Spare Parts
```bash
curl -X GET http://localhost:5000/api/spareparts \
  -b cookies.txt
```

### Create Stock Out
```bash
curl -X POST http://localhost:5000/api/stockout \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"sparePartId":1,"stockOutQuantity":5,"stockOutUnitPrice":15.99,"stockOutDate":"2024-01-21"}'
```

---

## Testing with Postman

1. Create new collection: "SIMS API"
2. Add requests for each endpoint
3. Set base URL: `{{base_url}}`
4. Use environment variable: `base_url=http://localhost:5000/api`
5. For authenticated requests, enable cookie jar
6. Test workflows to verify data consistency
