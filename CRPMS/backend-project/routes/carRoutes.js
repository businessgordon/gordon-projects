const express = require('express');
const router = express.Router();
const CarController = require('../controllers/carController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, CarController.getAll);
router.get('/:plate', requireAuth, CarController.getOne);
router.post('/', requireAuth, CarController.create);
router.put('/:plate', requireAuth, CarController.update);
router.delete('/:plate', requireAuth, CarController.delete);

module.exports = router;
