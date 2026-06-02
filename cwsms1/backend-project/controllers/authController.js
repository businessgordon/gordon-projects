const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/userModel');

function generateToken(user) {
  return jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function register(req, res) {
  const { username, email, password, role = 'admin' } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser({ username, email, password: hashed, role });
  const token = generateToken({ user_id: user.id, role: user.role });
  res.status(201).json({ user: { id: user.id, username, email, role }, token });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Email or password incorrect' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Email or password incorrect' });
  }

  const token = generateToken(user);
  res.json({ user: { id: user.user_id, username: user.username, email: user.email, role: user.role }, token });
}

module.exports = { register, login };
