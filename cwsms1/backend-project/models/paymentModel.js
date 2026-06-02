const { pool } = require('../config/db');

async function getPayments(search, page, limit, startDate, endDate) {
  const offset = (page - 1) * limit;
  const keyword = `%${search || ''}%`;
  const conditions = [];
  let query = `SELECT p.*, s.plate_number, s.package_number, s.service_date, c.driver_name, c.phone_number
     FROM Payment p
     LEFT JOIN ServicePackage s ON p.record_number = s.record_number
     LEFT JOIN Cars c ON s.plate_number = c.plate_number
     WHERE (c.driver_name LIKE ? OR s.plate_number LIKE ? OR p.payment_method LIKE ? OR p.payment_status LIKE ?)`;
  conditions.push(keyword, keyword, keyword, keyword);
  if (startDate && endDate) {
    query += ' AND p.payment_date BETWEEN ? AND ?';
    conditions.push(startDate, endDate);
  }
  query += ' ORDER BY p.payment_date DESC LIMIT ? OFFSET ?';
  conditions.push(Number(limit), Number(offset));
  const [rows] = await pool.query(query, conditions);
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM Payment p
     LEFT JOIN ServicePackage s ON p.record_number = s.record_number
     LEFT JOIN Cars c ON s.plate_number = c.plate_number
     WHERE (c.driver_name LIKE ? OR s.plate_number LIKE ? OR p.payment_method LIKE ? OR p.payment_status LIKE ?)`,
    [keyword, keyword, keyword, keyword]
  );
  return { rows, total };
}

async function getPayment(payment_number) {
  const [rows] = await pool.query('SELECT * FROM Payment WHERE payment_number = ?', [payment_number]);
  return rows[0];
}

async function createPayment({ record_number, amount_paid, payment_date, payment_method, payment_status }) {
  const [result] = await pool.query(
    'INSERT INTO Payment (record_number, amount_paid, payment_date, payment_method, payment_status) VALUES (?, ?, ?, ?, ?)',
    [record_number, amount_paid, payment_date, payment_method, payment_status]
  );
  return result.insertId;
}

async function updatePayment(payment_number, updates) {
  const { amount_paid, payment_date, payment_method, payment_status } = updates;
  await pool.query(
    'UPDATE Payment SET amount_paid = ?, payment_date = ?, payment_method = ?, payment_status = ? WHERE payment_number = ?',
    [amount_paid, payment_date, payment_method, payment_status, payment_number]
  );
}

module.exports = { getPayments, getPayment, createPayment, updatePayment };
