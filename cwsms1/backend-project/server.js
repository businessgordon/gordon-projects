const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const packageRoutes = require('./routes/packageRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { errorHandler } = require('./middleware/error');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({ status: 'CWSMS API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`CWSMS backend listening on port ${PORT}`);
});
