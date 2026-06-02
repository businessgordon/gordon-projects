const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Register user
const register = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // Validate input
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const connection = await pool.getConnection();

    // Check if username already exists
    const [existingUser] = await connection.query('SELECT userId FROM users WHERE username = ?', [username]);
    
    if (existingUser.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    connection.release();

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const connection = await pool.getConnection();

    // Find user
    const [users] = await connection.query('SELECT userId, username, password FROM users WHERE username = ?', [username]);

    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Set session
    req.session.userId = user.userId;
    req.session.username = user.username;

    res.status(200).json({ 
      message: 'Login successful',
      user: {
        userId: user.userId,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Logout user
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
};

// Get current user
const getCurrentUser = (req, res) => {
  if (req.session && req.session.userId) {
    res.status(200).json({
      user: {
        userId: req.session.userId,
        username: req.session.username
      }
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

module.exports = { register, login, logout, getCurrentUser };
