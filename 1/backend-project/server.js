const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'epms-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 4,
      httpOnly: true,
    },
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/reports', reportRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

async function seedAdminUser() {
  try {
    const passwordHash = await bcrypt.hash('SmartPark123', 10);
    const [existing] = await db.query('SELECT id FROM Users WHERE username = ?', ['admin']);

    if (existing.length) {
      await db.query('UPDATE Users SET password_hash = ? WHERE username = ?', [passwordHash, 'admin']);
    } else {
      await db.query('INSERT INTO Users (username, password_hash) VALUES (?, ?)', ['admin', passwordHash]);
    }

    console.log('Admin user seed verified');
  } catch (error) {
    console.error('Admin seed error:', error);
  }
}

app.listen(PORT, async () => {
  await seedAdminUser();
  console.log(`EPMS backend running on port ${PORT}`);
});
