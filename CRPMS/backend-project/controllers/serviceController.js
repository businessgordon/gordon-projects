const ServiceModel = require('../models/serviceModel');

const ServiceController = {
  async getAll(req, res) {
    try {
      const services = await ServiceModel.getAll();
      res.json(services);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching services.', error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const service = await ServiceModel.getByCode(req.params.code);
      if (!service) return res.status(404).json({ message: 'Service not found.' });
      res.json(service);
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { serviceCode, serviceName, servicePrice } = req.body;
      if (!serviceCode || !serviceName || !servicePrice)
        return res.status(400).json({ message: 'All fields required.' });
      await ServiceModel.create(serviceCode, serviceName, servicePrice);
      res.status(201).json({ message: 'Service created.' });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { serviceName, servicePrice } = req.body;
      await ServiceModel.update(req.params.code, serviceName, servicePrice);
      res.json({ message: 'Service updated.' });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await ServiceModel.delete(req.params.code);
      res.json({ message: 'Service deleted.' });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  }
};

module.exports = ServiceController;
