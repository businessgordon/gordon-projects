const db = require('../config/db');

const CarModel = {
  async getAll() {
    const [rows] = await db.execute('SELECT * FROM Car ORDER BY PlateNumber');
    return rows;
  },

  async getByPlate(plate) {
    const [rows] = await db.execute('SELECT * FROM Car WHERE PlateNumber = ?', [plate]);
    return rows[0];
  },

  async create(plateNumber, type, model, manufacturingYear, driverPhone, mechanicName) {
    const [result] = await db.execute(
      'INSERT INTO Car (PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName) VALUES (?, ?, ?, ?, ?, ?)',
      [plateNumber, type, model, manufacturingYear, driverPhone, mechanicName]
    );
    return result;
  },

  async update(plateNumber, type, model, manufacturingYear, driverPhone, mechanicName) {
    const [result] = await db.execute(
      'UPDATE Car SET Type=?, Model=?, ManufacturingYear=?, DriverPhone=?, MechanicName=? WHERE PlateNumber=?',
      [type, model, manufacturingYear, driverPhone, mechanicName, plateNumber]
    );
    return result;
  },

  async delete(plateNumber) {
    const [result] = await db.execute('DELETE FROM Car WHERE PlateNumber = ?', [plateNumber]);
    return result;
  }
};

module.exports = CarModel;
