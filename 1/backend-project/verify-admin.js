const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'EPMS' });
    const [rows] = await conn.query('SELECT username, password_hash FROM Users WHERE username=?', ['admin']);
    const match = await bcrypt.compare('SmartPark123', rows[0].password_hash);
    console.log('ADMIN_ROW', JSON.stringify(rows, null, 2));
    console.log('MATCH', match);
    await conn.end();
  } catch (e) {
    console.error('DB_ERR', e.code, e.message);
    process.exitCode = 1;
  }
})();
