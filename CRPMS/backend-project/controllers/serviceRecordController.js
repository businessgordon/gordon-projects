const ServiceRecordModel = require('../models/serviceRecordModel');

const ServiceRecordController = {
  async getAll(req, res) {
    try {
      const records = await ServiceRecordModel.getAll();
      res.json(records);
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const record = await ServiceRecordModel.getById(req.params.id);
      if (!record) return res.status(404).json({ message: 'Record not found.' });
      res.json(record);
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { serviceDate, plateNumber, serviceCode } = req.body;
      if (!serviceDate || !plateNumber || !serviceCode)
        return res.status(400).json({ message: 'All fields required.' });
      const result = await ServiceRecordModel.create(serviceDate, plateNumber, serviceCode);
      res.status(201).json({ message: 'Service record created.', id: result.insertId });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { serviceDate, plateNumber, serviceCode } = req.body;
      await ServiceRecordModel.update(req.params.id, serviceDate, plateNumber, serviceCode);
      res.json({ message: 'Service record updated.' });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await ServiceRecordModel.delete(req.params.id);
      res.json({ message: 'Service record deleted.' });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async getDailyReport(req, res) {
    try {
      const { date } = req.query;
      if (!date) return res.status(400).json({ message: 'Date required.' });
      const report = await ServiceRecordModel.getDailyReport(date);
      res.json(report);
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  }
};

module.exports = ServiceRecordController;
