const db = require('../config/db');

const UserModel = {
  async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM User WHERE Username = ?', [username]);
    return rows[0];
  },

  async create(username, hashedPassword, fullName) {
    const [result] = await db.execute(
      'INSERT INTO User (Username, Password, FullName) VALUES (?, ?, ?)',
      [username, hashedPassword, fullName]
    );
    return result;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT UserID, Username, FullName FROM User WHERE UserID = ?', [id]);
    return rows[0];
  }
};

module.exports = UserModel;
