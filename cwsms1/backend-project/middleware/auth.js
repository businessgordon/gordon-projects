const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const [rows] = await pool.query('SELECT user_id, username, email, role FROM Users WHERE user_id = ?', [decoded.id]);
    if (!rows.length) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    req.user = rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
}

module.exports = { protect, authorizeRoles };
