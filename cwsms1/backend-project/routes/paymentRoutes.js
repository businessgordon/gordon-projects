const express = require('express');
const { protect } = require('../middleware/auth');
const { listPayments, getPaymentById, createNewPayment, updateExistingPayment } = require('../controllers/paymentController');
const router = express.Router();

router.use(protect);
router.get('/', listPayments);
router.get('/:payment_number', getPaymentById);
router.post('/', createNewPayment);
router.put('/:payment_number', updateExistingPayment);

module.exports = router;
