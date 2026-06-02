const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'EPMS' });
    const [rows] = await conn.query('SELECT id, username, password_hash FROM Users WHERE username=?', ['admin']);
    console.log('ROWS', JSON.stringify(rows, null, 2));
    await conn.end();
  } catch (e) {
    console.error('DB_ERR', e.code, e.message);
    process.exitCode = 1;
  }
})();
