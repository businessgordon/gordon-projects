const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.payment_id, c.plate_number, pr.entry_time, pr.exit_time, pr.duration, p.amount_paid, p.payment_date
       FROM payments p
       JOIN parking_records pr ON p.record_id = pr.record_id
       JOIN cars c ON pr.car_id = c.car_id
       ORDER BY p.payment_date DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
});

router.post('/', async (req, res) => {
  const { record_id, amount_paid, payment_date } = req.body;
  if (!record_id || !amount_paid || !payment_date) {
    return res.status(400).json({ error: 'Missing payment information.' });
  }
  try {
    await pool.query(
      'INSERT INTO payments (record_id, amount_paid, payment_date) VALUES (?, ?, ?)',
      [record_id, amount_paid, payment_date]
    );
    res.status(201).json({ message: 'Payment recorded.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record payment.' });
  }
});

module.exports = router;
