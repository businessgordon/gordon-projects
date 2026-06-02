const express = require('express');
const router = express.Router();
const { getAllSpareParts, getSparePartById, createSparePart, updateSparePart, deleteSparePart } = require('../controllers/sparePartController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, getAllSpareParts);
router.get('/:id', isAuthenticated, getSparePartById);
router.post('/', isAuthenticated, createSparePart);
router.put('/:id', isAuthenticated, updateSparePart);
router.delete('/:id', isAuthenticated, deleteSparePart);

module.exports = router;
