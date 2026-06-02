const { pool } = require('../config/db');

async function getCars(search, page, limit) {
  const offset = (page - 1) * limit;
  const keyword = `%${search || ''}%`;
  const [rows] = await pool.query(
    `SELECT * FROM Cars WHERE plate_number LIKE ? OR driver_name LIKE ? OR phone_number LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [keyword, keyword, keyword, Number(limit), Number(offset)]
  );
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM Cars WHERE plate_number LIKE ? OR driver_name LIKE ? OR phone_number LIKE ?`,
    [keyword, keyword, keyword]
  );
  return { rows, total };
}

async function getCar(plate_number) {
  const [rows] = await pool.query('SELECT * FROM Cars WHERE plate_number = ?', [plate_number]);
  return rows[0];
}

async function createCar(car) {
  const { plate_number, car_type, car_size, driver_name, phone_number } = car;
  await pool.query(
    'INSERT INTO Cars (plate_number, car_type, car_size, driver_name, phone_number, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [plate_number, car_type, car_size, driver_name, phone_number]
  );
}

async function updateCar(plate_number, updates) {
  const { car_type, car_size, driver_name, phone_number } = updates;
  await pool.query(
    'UPDATE Cars SET car_type = ?, car_size = ?, driver_name = ?, phone_number = ? WHERE plate_number = ?',
    [car_type, car_size, driver_name, phone_number, plate_number]
  );
}

async function deleteCar(plate_number) {
  await pool.query('DELETE FROM Cars WHERE plate_number = ?', [plate_number]);
}

module.exports = { getCars, getCar, createCar, updateCar, deleteCar };
