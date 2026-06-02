const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

async function ensureAdminUser() {
  const [rows] = await pool.query('SELECT * FROM users WHERE Username = ?', ['admin']);
  if (rows.length === 0) {
    const hash = await bcrypt.hash('Gordon@123', 10);
    await pool.query('INSERT INTO users (Username, Password, CreatedAt) VALUES (?, ?, NOW())', ['admin', hash]);
  }
}

ensureAdminUser().catch(console.error);

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('LOGIN ATTEMPT', { username, hasPassword: !!password });

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE Username = ?', [username]);
    if (rows.length === 0) {
      console.warn('Login failed: user not found', username);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const user = rows[0];
    const authPasswordHash = user.Password || user.password_hash || user.password;
    const authUserId = user.UserID || user.user_id;
    const authUsername = user.Username || user.username;

    console.log('LOGIN USER', { authUserId, authUsername, authPasswordHashExists: !!authPasswordHash });
    if (!authPasswordHash) {
      console.error('Missing password hash for user', username, user);
      return res.status(500).json({ error: 'User authentication is not configured correctly.' });
    }
    const match = await bcrypt.compare(password, authPasswordHash);
    if (!match) {
      console.warn('Login failed: password mismatch', username);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    req.session.user = { id: authUserId, username: authUsername };
    res.json({ username: authUsername });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

router.get('/me', (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  }
  res.status(401).json({ error: 'Not authenticated.' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
