const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'CWSMS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function connectDB() {
  try {
    await pool.getConnection();
    console.log('Connected to MySQL database');
  } catch (error) {
    console.error('MySQL connection error:', error.message);
    process.exit(1);
  }
}

module.exports = { pool, connectDB };
