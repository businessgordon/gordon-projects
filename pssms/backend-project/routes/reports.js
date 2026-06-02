const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/daily', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.plate_number, pr.entry_time, pr.exit_time, pr.duration, p.amount_paid, p.payment_date
       FROM payments p
       JOIN parking_records pr ON p.record_id = pr.record_id
       JOIN cars c ON pr.car_id = c.car_id
       WHERE DATE(p.payment_date) = CURDATE()
       ORDER BY p.payment_date DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch daily report.' });
  }
});

router.get('/bill/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT c.plate_number, pr.entry_time, pr.exit_time, pr.duration, p.amount_paid, p.payment_date
       FROM payments p
       JOIN parking_records pr ON p.record_id = pr.record_id
       JOIN cars c ON pr.car_id = c.car_id
       WHERE p.payment_id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bill.' });
  }
});

module.exports = router;
