const bcrypt = require('bcrypt');
const db = require('../config/db');

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [rows] = await db.query('SELECT id, username, password_hash FROM Users WHERE username = ?', [username]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    return res.json({ message: 'Login successful', username: user.username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login error' });
  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logout successful' });
  });
}

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM Users WHERE username = ?', [username]);
    if (existing.length) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO Users (username, password_hash) VALUES (?, ?)', [username, password_hash]);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Registration error' });
  }
}

module.exports = { login, logout, register };
