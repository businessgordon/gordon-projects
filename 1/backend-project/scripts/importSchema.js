const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function run() {
  const sqlPath = path.join(__dirname, '..', '..', 'epms-schema.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('Schema file not found at', sqlPath);
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    // Drop existing database completely to clear tablespace issues
    await connection.query('DROP DATABASE IF EXISTS EPMS');
    // Now create fresh database and import schema
    await connection.query(sql);
    console.log('EPMS schema imported successfully');
  } catch (err) {
    console.error('Import error:', err.message || err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

run();
