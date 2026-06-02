# Stock Inventory Management System (SIMS)

A modern, responsive full-stack web application for managing spare parts inventory at SmartPark (Rubavu District, Rwanda).

## Features

- **User Authentication**: Secure login/registration with encrypted passwords
- **Spare Parts Management**: Add, edit, delete, and view spare parts inventory
- **Stock In Records**: Record incoming stock with automatic quantity updates
- **Stock Out Records**: Record outgoing stock with full CRUD operations
- **Dashboard**: Real-time statistics and recent activities
- **Reports**: Daily stock-out reports and stock status reports
- **Responsive UI**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **Bcrypt** - Password hashing
- **Express-session** - Session management

## Project Structure

```
SIMS/
├── backend-project/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── sparePartController.js
│   │   ├── stockInController.js
│   │   └── stockOutController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── sparePartRoutes.js
│   │   ├── stockInRoutes.js
│   │   └── stockOutRoutes.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── database.sql
│
└── frontend-project/
    ├── src/
    │   ├── api/
    │   │   ├── api.js
    │   │   ├── userAPI.js
    │   │   ├── sparePartAPI.js
    │   │   ├── stockInAPI.js
    │   │   └── stockOutAPI.js
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── Modal.jsx
    │   │   └── Alert.jsx
    │   ├── layouts/
    │   │   └── Layout.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── SpareParts.jsx
    │   │   ├── StockInPage.jsx
    │   │   ├── StockOutPage.jsx
    │   │   └── ReportsPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Step 1: Database Setup

1. Open MySQL command line or MySQL Workbench
2. Run the SQL script to create database and tables:
   ```sql
   source backend-project/database.sql
   ```
   Or manually execute the contents of `database.sql`

### Step 2: Backend Setup

```bash
cd backend-project

# Install dependencies
npm install

# Update .env file with your database credentials
# .env defaults:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=sims_db
# PORT=5000

# Run the server
npm run dev
```

Server will be running at `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd frontend-project

# Install dependencies
npm install

# Run the development server
npm run dev
```

Frontend will be running at `http://localhost:5173`

## Default Login Credentials

- **Username**: admin
- **Password**: password123

## API Endpoints

### User Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/me` - Get current user

### Spare Parts (Full CRUD)
- `POST /api/spareparts` - Create spare part
- `GET /api/spareparts` - Get all spare parts
- `GET /api/spareparts/:id` - Get specific spare part
- `PUT /api/spareparts/:id` - Update spare part
- `DELETE /api/spareparts/:id` - Delete spare part

### Stock In (Create & Read)
- `POST /api/stockin` - Create stock in record
- `GET /api/stockin` - Get all stock in records
- `GET /api/stockin/:id` - Get specific stock in record

### Stock Out (Full CRUD)
- `POST /api/stockout` - Create stock out record
- `GET /api/stockout` - Get all stock out records
- `GET /api/stockout/:id` - Get specific stock out record
- `PUT /api/stockout/:id` - Update stock out record
- `DELETE /api/stockout/:id` - Delete stock out record

## Database Schema

### Users Table
- userId (Primary Key)
- username (Unique)
- password (Encrypted)
- createdAt

### Spare_Part Table
- sparePartId (Primary Key)
- name
- category
- quantity
- unitPrice
- totalPrice
- createdAt

### Stock_In Table
- stockInId (Primary Key)
- sparePartId (Foreign Key)
- stockInQuantity
- stockInDate
- createdAt

### Stock_Out Table
- stockOutId (Primary Key)
- sparePartId (Foreign Key)
- userId (Foreign Key)
- stockOutQuantity
- stockOutUnitPrice
- stockOutTotalPrice
- stockOutDate
- createdAt

## Features Overview

### Dashboard
- Total spare parts count
- Total stock in quantity
- Total stock out quantity
- Remaining stock display
- Total inventory value
- Recent stock out activities

### Spare Parts Management
- Add new spare parts
- View all spare parts in a table
- Edit spare part details
- Delete spare parts
- Search functionality

### Stock In Management
- Record incoming stock
- Automatic quantity updates
- View stock in history
- Filter and search records

### Stock Out Management
- Record outgoing stock
- Full CRUD operations
- Automatic quantity deduction
- Edit records
- Delete records with history update

### Reports
- Daily Stock Out Report
  - Spare part details
  - Quantities removed
  - Unit and total prices
  - Date and user information
  
- Stock Status Report
  - Spare part details
  - Current quantities
  - Stock in/out totals
  - Status indicators (In Stock/Low Stock/Out of Stock)

## UI/UX Features

- **Dark Sidebar Navigation** - Easy navigation with icon labels
- **Responsive Dashboard** - Statistics cards and charts
- **Modern Cards** - Clean, shadow-based card design
- **Search & Filter** - Find records quickly
- **Modal Forms** - User-friendly data entry
- **Alert Notifications** - Success/error feedback
- **Data Tables** - Sortable and searchable tables
- **Mobile Friendly** - Responsive on all devices
- **Color Scheme** - Blue and emerald accent colors
- **Hover Effects** - Interactive UI elements

## Security Features

- **Password Encryption** - Bcrypt hashing
- **Session-Based Auth** - Secure session management
- **Input Validation** - Server and client-side validation
- **SQL Injection Prevention** - Parameterized queries
- **CORS Protection** - Cross-origin request handling
- **Duplicate Prevention** - Username and spare part uniqueness

## Future Enhancements

- Email notifications for low stock
- Role-based access control (Admin, Manager, Viewer)
- Barcode scanning for quick inventory updates
- Advanced analytics and charts
- Multi-language support
- Export reports to PDF/Excel
- Inventory forecasting

## Troubleshooting

### Database Connection Error
- Ensure MySQL server is running
- Check database credentials in `.env`
- Verify database and tables exist

### Port Already in Use
- Change PORT in `.env` (backend)
- Change port in `vite.config.js` (frontend)

### CORS Error
- Ensure frontend URL matches CORS origin in server.js
- Check credentials: true in axios config

### Module Not Found
- Run `npm install` in both frontend and backend
- Clear node_modules and reinstall if issues persist

## Support

For issues or questions, please review the code comments or contact the development team.

## License

MIT

## Company

**SmartPark Inc.**
Rubavu District, Rwanda
