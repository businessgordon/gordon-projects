const { getPayments, getPayment, createPayment, updatePayment } = require('../models/paymentModel');

async function listPayments(req, res) {
  const { search = '', page = 1, limit = 10, startDate, endDate } = req.query;
  const data = await getPayments(search, page, limit, startDate, endDate);
  res.json(data);
}

async function getPaymentById(req, res) {
  const payment = await getPayment(req.params.payment_number);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  res.json(payment);
}

async function createNewPayment(req, res) {
  const { record_number, amount_paid, payment_date, payment_method, payment_status } = req.body;
  if (!record_number || !amount_paid || !payment_date || !payment_method) {
    return res.status(400).json({ message: 'Record, amount, date and payment method are required' });
  }
  const id = await createPayment({ record_number, amount_paid, payment_date, payment_method, payment_status });
  res.status(201).json({ message: 'Payment recorded', payment_number: id });
}

async function updateExistingPayment(req, res) {
  await updatePayment(req.params.payment_number, req.body);
  res.json({ message: 'Payment updated' });
}

module.exports = { listPayments, getPaymentById, createNewPayment, updateExistingPayment };
