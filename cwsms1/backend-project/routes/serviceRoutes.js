const express = require('express');
const { protect } = require('../middleware/auth');
const { listServices, getServiceRecord, createServiceRecord, updateServiceRecord, deleteServiceRecord } = require('../controllers/serviceController');
const router = express.Router();

router.use(protect);
router.get('/', listServices);
router.get('/:record_number', getServiceRecord);
router.post('/', createServiceRecord);
router.put('/:record_number', updateServiceRecord);
router.delete('/:record_number', deleteServiceRecord);

module.exports = router;
