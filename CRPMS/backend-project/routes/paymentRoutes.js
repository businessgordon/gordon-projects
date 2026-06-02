const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, PaymentController.getAll);
router.get('/report/daily', requireAuth, PaymentController.getDailyReport);
router.get('/:id', requireAuth, PaymentController.getOne);
router.post('/', requireAuth, PaymentController.create);

module.exports = router;
