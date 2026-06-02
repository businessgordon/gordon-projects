const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const carRoutes = require('./routes/carRoutes');
const serviceRecordRoutes = require('./routes/serviceRecordRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'crpms_secret_key_2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8 // 8 hours
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/servicerecords', serviceRecordRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CRPMS API is running.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
