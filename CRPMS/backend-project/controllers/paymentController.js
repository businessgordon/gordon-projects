const PaymentModel = require('../models/paymentModel');

const PaymentController = {
  async getAll(req, res) {
    try {
      const payments = await PaymentModel.getAll();
      res.json(payments);
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const payment = await PaymentModel.getById(req.params.id);
      if (!payment) return res.status(404).json({ message: 'Payment not found.' });
      res.json(payment);
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { amountPaid, paymentDate, recordNumber } = req.body;
      const userId = req.session.user ? req.session.user.UserID : null;
      if (!amountPaid || !paymentDate || !recordNumber)
        return res.status(400).json({ message: 'All fields required.' });
      const result = await PaymentModel.create(amountPaid, paymentDate, recordNumber, userId);
      res.status(201).json({ message: 'Payment recorded.', id: result.insertId });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  },

  async getDailyReport(req, res) {
    try {
      const { date } = req.query;
      if (!date) return res.status(400).json({ message: 'Date required.' });
      const report = await PaymentModel.getDailyReport(date);
      const total = report.reduce((sum, r) => sum + Number(r.AmountPaid), 0);
      res.json({ report, total });
    } catch (err) {
      res.status(500).json({ message: 'Error.', error: err.message });
    }
  }
};

module.exports = PaymentController;
