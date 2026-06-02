const express = require('express');
const { protect } = require('../middleware/auth');
const { listCars, getCarById, addCar, editCar, removeCar } = require('../controllers/carController');
const router = express.Router();

router.use(protect);
router.get('/', listCars);
router.get('/:plate_number', getCarById);
router.post('/', addCar);
router.put('/:plate_number', editCar);
router.delete('/:plate_number', removeCar);

module.exports = router;
