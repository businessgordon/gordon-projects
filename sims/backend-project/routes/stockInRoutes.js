const express = require('express');
const router = express.Router();
const { getAllStockIn, getStockInById, createStockIn } = require('../controllers/stockInController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, getAllStockIn);
router.get('/:id', isAuthenticated, getStockInById);
router.post('/', isAuthenticated, createStockIn);

module.exports = router;
