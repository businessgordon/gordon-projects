const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

const AuthController = {
  async register(req, res) {
    try {
      const { username, password, fullName } = req.body;
      if (!username || !password || !fullName)
        return res.status(400).json({ message: 'All fields are required.' });

      const existing = await UserModel.findByUsername(username);
      if (existing)
        return res.status(400).json({ message: 'Username already exists.' });

      const hashed = await bcrypt.hash(password, 12);
      await UserModel.create(username, hashed, fullName);
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        return res.status(400).json({ message: 'Username and password required.' });

      const user = await UserModel.findByUsername(username);
      if (!user)
        return res.status(401).json({ message: 'Invalid credentials.' });

      const valid = await bcrypt.compare(password, user.Password);
      if (!valid)
        return res.status(401).json({ message: 'Invalid credentials.' });

      req.session.user = { UserID: user.UserID, Username: user.Username, FullName: user.FullName };
      res.json({ message: 'Login successful.', user: req.session.user });
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.json({ message: 'Logged out.' });
    });
  },

  me(req, res) {
    if (req.session && req.session.user) {
      return res.json({ user: req.session.user });
    }
    res.status(401).json({ message: 'Not authenticated.' });
  }
};

module.exports = AuthController;
