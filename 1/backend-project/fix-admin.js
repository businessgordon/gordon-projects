const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'EPMS' });
    const hash = await bcrypt.hash('SmartPark123', 10);
    await conn.query('UPDATE Users SET password_hash=? WHERE username=?', [hash, 'admin']);
    await conn.query('INSERT INTO Users (username, password_hash) SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM Users WHERE username=?)', ['admin', hash, 'admin']);
    console.log('UPDATED_HASH', hash);
    await conn.end();
  } catch (e) {
    console.error('DB_ERR', e.code, e.message);
    process.exitCode = 1;
  }
})();
