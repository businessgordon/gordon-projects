const { pool } = require('../config/db');

async function getServices(search, page, limit) {
  const offset = (page - 1) * limit;
  const keyword = `%${search || ''}%`;
  const [rows] = await pool.query(
    `SELECT s.*, c.car_type, c.car_size, c.driver_name, c.phone_number, p.package_name, p.package_price
     FROM ServicePackage s
     LEFT JOIN Cars c ON s.plate_number = c.plate_number
     LEFT JOIN Packages p ON s.package_number = p.package_number
     WHERE s.plate_number LIKE ? OR c.driver_name LIKE ? OR p.package_name LIKE ?
     ORDER BY s.service_date DESC
     LIMIT ? OFFSET ?`,
    [keyword, keyword, keyword, Number(limit), Number(offset)]
  );
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM ServicePackage s
     LEFT JOIN Cars c ON s.plate_number = c.plate_number
     LEFT JOIN Packages p ON s.package_number = p.package_number
     WHERE s.plate_number LIKE ? OR c.driver_name LIKE ? OR p.package_name LIKE ?`,
    [keyword, keyword, keyword]
  );
  return { rows, total };
}

async function getService(record_number) {
  const [rows] = await pool.query('SELECT * FROM ServicePackage WHERE record_number = ?', [record_number]);
  return rows[0];
}

async function createService({ plate_number, package_number, service_date, status }) {
  const [result] = await pool.query(
    'INSERT INTO ServicePackage (plate_number, package_number, service_date, status) VALUES (?, ?, ?, ?)',
    [plate_number, package_number, service_date, status]
  );
  return result.insertId;
}

async function updateService(record_number, updates) {
  const { plate_number, package_number, service_date, status } = updates;
  await pool.query(
    'UPDATE ServicePackage SET plate_number = ?, package_number = ?, service_date = ?, status = ? WHERE record_number = ?',
    [plate_number, package_number, service_date, status, record_number]
  );
}

async function deleteService(record_number) {
  await pool.query('DELETE FROM ServicePackage WHERE record_number = ?', [record_number]);
}

module.exports = { getServices, getService, createService, updateService, deleteService };
