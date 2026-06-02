const express = require('express');
const router = express.Router();
const ServiceRecordController = require('../controllers/serviceRecordController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, ServiceRecordController.getAll);
router.get('/report/daily', requireAuth, ServiceRecordController.getDailyReport);
router.get('/:id', requireAuth, ServiceRecordController.getOne);
router.post('/', requireAuth, ServiceRecordController.create);
router.put('/:id', requireAuth, ServiceRecordController.update);
router.delete('/:id', requireAuth, ServiceRecordController.delete);

module.exports = router;
