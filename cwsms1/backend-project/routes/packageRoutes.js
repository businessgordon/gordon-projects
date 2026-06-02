const express = require('express');
const { protect } = require('../middleware/auth');
const { listPackages, getPackage, createNewPackage, updateExistingPackage, deleteExistingPackage } = require('../controllers/packageController');
const router = express.Router();

router.use(protect);
router.get('/', listPackages);
router.get('/:package_number', getPackage);
router.post('/', createNewPackage);
router.put('/:package_number', updateExistingPackage);
router.delete('/:package_number', deleteExistingPackage);

module.exports = router;
