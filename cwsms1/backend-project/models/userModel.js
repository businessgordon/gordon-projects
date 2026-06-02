const { pool } = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await pool.query('SELECT * FROM Users WHERE user_id = ?', [id]);
  return rows[0];
}

async function createUser({ username, email, password, role }) {
  const [result] = await pool.query(
    'INSERT INTO Users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
    [username, email, password, role]
  );
  return { id: result.insertId, username, email, role };
}

module.exports = { findUserByEmail, findUserById, createUser };
