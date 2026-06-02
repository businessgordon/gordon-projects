const { getCars, getCar, createCar, updateCar, deleteCar } = require('../models/carModel');

async function listCars(req, res) {
  const { search = '', page = 1, limit = 10 } = req.query;
  const data = await getCars(search, page, limit);
  res.json(data);
}

async function getCarById(req, res) {
  const car = await getCar(req.params.plate_number);
  if (!car) return res.status(404).json({ message: 'Car not found' });
  res.json(car);
}

async function addCar(req, res) {
  const { plate_number, car_type, car_size, driver_name, phone_number } = req.body;
  if (!plate_number || !driver_name || !phone_number) {
    return res.status(400).json({ message: 'Plate number, driver name and phone number are required' });
  }
  await createCar({ plate_number, car_type, car_size, driver_name, phone_number });
  res.status(201).json({ message: 'Car created' });
}

async function editCar(req, res) {
  await updateCar(req.params.plate_number, req.body);
  res.json({ message: 'Car updated' });
}

async function removeCar(req, res) {
  await deleteCar(req.params.plate_number);
  res.json({ message: 'Car removed' });
}

module.exports = { listCars, getCarById, addCar, editCar, removeCar };
