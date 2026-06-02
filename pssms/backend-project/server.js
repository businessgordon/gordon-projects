const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const slotRoutes = require('./routes/slots');
const recordRoutes = require('./routes/records');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'pssms-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'PSSMS backend is running' });
});

app.listen(PORT, () => {
  console.log(`PSSMS backend listening on port ${PORT}`);
});
