const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({ host:'localhost', user:'root', password:'' });
  try {
    const [rows] = await conn.query("SELECT TABLE_SCHEMA, TABLE_NAME, ENGINE, TABLE_ROWS FROM information_schema.tables WHERE TABLE_SCHEMA = 'EPMS'");
    if (!rows.length) {
      console.log('No tables found in EPMS or database EPMS does not exist');
    } else {
      console.table(rows);
    }
  } catch (err) {
    console.error('Query error:', err.message || err);
  } finally {
    await conn.end();
  }
}

run();
