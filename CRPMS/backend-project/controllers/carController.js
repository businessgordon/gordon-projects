const CarModel = require('../models/carModel');

const CarController = {
  async getAll(req, res) {
    try {
      const cars = await CarModel.getAll();
      res.json(cars);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching cars.', error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const car = await CarModel.getByPlate(req.params.plate);
      if (!car) return res.status(404).json({ message: 'Car not found.' });
      res.json(car);
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { plateNumber, type, model, manufacturingYear, driverPhone, mechanicName } = req.body;
      if (!plateNumber || !type || !model || !manufacturingYear || !driverPhone || !mechanicName)
        return res.status(400).json({ message: 'All fields required.' });
      await CarModel.create(plateNumber, type, model, manufacturingYear, driverPhone, mechanicName);
      res.status(201).json({ message: 'Car registered.' });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { type, model, manufacturingYear, driverPhone, mechanicName } = req.body;
      await CarModel.update(req.params.plate, type, model, manufacturingYear, driverPhone, mechanicName);
      res.json({ message: 'Car updated.' });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await CarModel.delete(req.params.plate);
      res.json({ message: 'Car deleted.' });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  }
};

module.exports = CarController;
