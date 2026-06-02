const db = require('../config/db');

const ServiceModel = {
  async getAll() {
    const [rows] = await db.execute('SELECT * FROM Services ORDER BY ServiceName');
    return rows;
  },

  async getByCode(code) {
    const [rows] = await db.execute('SELECT * FROM Services WHERE ServiceCode = ?', [code]);
    return rows[0];
  },

  async create(serviceCode, serviceName, servicePrice) {
    const [result] = await db.execute(
      'INSERT INTO Services (ServiceCode, ServiceName, ServicePrice) VALUES (?, ?, ?)',
      [serviceCode, serviceName, servicePrice]
    );
    return result;
  },

  async update(serviceCode, serviceName, servicePrice) {
    const [result] = await db.execute(
      'UPDATE Services SET ServiceName = ?, ServicePrice = ? WHERE ServiceCode = ?',
      [serviceName, servicePrice, serviceCode]
    );
    return result;
  },

  async delete(serviceCode) {
    const [result] = await db.execute('DELETE FROM Services WHERE ServiceCode = ?', [serviceCode]);
    return result;
  }
};

module.exports = ServiceModel;
