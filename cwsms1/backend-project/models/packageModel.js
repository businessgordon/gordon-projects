const { pool } = require('../config/db');

async function getPackages(search) {
  const keyword = `%${search || ''}%`;
  const [rows] = await pool.query(
    'SELECT * FROM Packages WHERE package_name LIKE ? OR package_description LIKE ? ORDER BY package_number ASC',
    [keyword, keyword]
  );
  return rows;
}

async function getPackageByNumber(package_number) {
  const [rows] = await pool.query('SELECT * FROM Packages WHERE package_number = ?', [package_number]);
  return rows[0];
}

async function createPackage({ package_name, package_description, package_price }) {
  const [result] = await pool.query(
    'INSERT INTO Packages (package_name, package_description, package_price) VALUES (?, ?, ?)',
    [package_name, package_description, package_price]
  );
  return result.insertId;
}

async function updatePackage(package_number, updates) {
  const { package_name, package_description, package_price } = updates;
  await pool.query(
    'UPDATE Packages SET package_name = ?, package_description = ?, package_price = ? WHERE package_number = ?',
    [package_name, package_description, package_price, package_number]
  );
}

async function deletePackage(package_number) {
  await pool.query('DELETE FROM Packages WHERE package_number = ?', [package_number]);
}

module.exports = { getPackages, getPackageByNumber, createPackage, updatePackage, deletePackage };
