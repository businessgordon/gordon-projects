const db = require('../config/db');

const PaymentModel = {
  async getAll() {
    const [rows] = await db.execute(`
      SELECT p.PaymentNumber, p.AmountPaid, p.PaymentDate, p.RecordNumber,
             sr.PlateNumber, sr.ServiceDate,
             s.ServiceName, s.ServicePrice,
             c.Model, c.Type, c.DriverPhone,
             u.FullName AS ReceivedBy
      FROM Payment p
      JOIN ServiceRecord sr ON p.RecordNumber = sr.RecordNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      LEFT JOIN User u ON p.UserID = u.UserID
      ORDER BY p.PaymentDate DESC
    `);
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute(`
      SELECT p.PaymentNumber, p.AmountPaid, p.PaymentDate, p.RecordNumber,
             sr.PlateNumber, sr.ServiceDate,
             s.ServiceName, s.ServicePrice,
             c.Model, c.Type, c.DriverPhone, c.MechanicName,
             u.FullName AS ReceivedBy, u.Username
      FROM Payment p
      JOIN ServiceRecord sr ON p.RecordNumber = sr.RecordNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      LEFT JOIN User u ON p.UserID = u.UserID
      WHERE p.PaymentNumber = ?
    `, [id]);
    return rows[0];
  },

  async create(amountPaid, paymentDate, recordNumber, userId) {
    const [result] = await db.execute(
      'INSERT INTO Payment (AmountPaid, PaymentDate, RecordNumber, UserID) VALUES (?, ?, ?, ?)',
      [amountPaid, paymentDate, recordNumber, userId]
    );
    return result;
  },

  async getDailyReport(date) {
    const [rows] = await db.execute(`
      SELECT p.PaymentNumber, p.AmountPaid, p.PaymentDate,
             sr.PlateNumber, sr.ServiceDate,
             s.ServiceName, s.ServicePrice,
             c.Model, c.Type, c.DriverPhone, c.MechanicName,
             u.FullName AS ReceivedBy
      FROM Payment p
      JOIN ServiceRecord sr ON p.RecordNumber = sr.RecordNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      LEFT JOIN User u ON p.UserID = u.UserID
      WHERE DATE(p.PaymentDate) = ?
      ORDER BY p.PaymentDate DESC
    `, [date]);
    return rows;
  }
};

module.exports = PaymentModel;
