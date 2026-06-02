const db = require('../config/db');

const ServiceRecordModel = {
  async getAll() {
    const [rows] = await db.execute(`
      SELECT sr.RecordNumber, sr.ServiceDate, sr.PlateNumber, sr.ServiceCode,
             c.Model, c.Type, c.DriverPhone, c.MechanicName,
             s.ServiceName, s.ServicePrice
      FROM ServiceRecord sr
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      ORDER BY sr.ServiceDate DESC
    `);
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute(`
      SELECT sr.RecordNumber, sr.ServiceDate, sr.PlateNumber, sr.ServiceCode,
             c.Model, c.Type, c.DriverPhone, c.MechanicName,
             s.ServiceName, s.ServicePrice
      FROM ServiceRecord sr
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      WHERE sr.RecordNumber = ?
    `, [id]);
    return rows[0];
  },

  async create(serviceDate, plateNumber, serviceCode) {
    const [result] = await db.execute(
      'INSERT INTO ServiceRecord (ServiceDate, PlateNumber, ServiceCode) VALUES (?, ?, ?)',
      [serviceDate, plateNumber, serviceCode]
    );
    return result;
  },

  async update(recordNumber, serviceDate, plateNumber, serviceCode) {
    const [result] = await db.execute(
      'UPDATE ServiceRecord SET ServiceDate=?, PlateNumber=?, ServiceCode=? WHERE RecordNumber=?',
      [serviceDate, plateNumber, serviceCode, recordNumber]
    );
    return result;
  },

  async delete(recordNumber) {
    const [result] = await db.execute('DELETE FROM ServiceRecord WHERE RecordNumber = ?', [recordNumber]);
    return result;
  },

  async getDailyReport(date) {
    const [rows] = await db.execute(`
      SELECT sr.RecordNumber, sr.ServiceDate, sr.PlateNumber,
             c.Model, c.Type, c.DriverPhone, c.MechanicName,
             s.ServiceName, s.ServicePrice,
             p.AmountPaid, p.PaymentDate, p.PaymentNumber,
             u.FullName AS ReceivedBy
      FROM ServiceRecord sr
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      LEFT JOIN Payment p ON sr.RecordNumber = p.RecordNumber
      LEFT JOIN User u ON p.UserID = u.UserID
      WHERE DATE(sr.ServiceDate) = ?
      ORDER BY sr.ServiceDate DESC
    `, [date]);
    return rows;
  }
};

module.exports = ServiceRecordModel;
