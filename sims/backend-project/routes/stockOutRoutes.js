const express = require('express');
const router = express.Router();
const { getAllStockOut, getStockOutById, createStockOut, updateStockOut, deleteStockOut } = require('../controllers/stockOutController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, getAllStockOut);
router.get('/:id', isAuthenticated, getStockOutById);
router.post('/', isAuthenticated, createStockOut);
router.put('/:id', isAuthenticated, updateStockOut);
router.delete('/:id', isAuthenticated, deleteStockOut);

module.exports = router;
