const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM parking_slots ORDER BY slot_number');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch parking slots.' });
  }
});

router.post('/', async (req, res) => {
  const { slot_number, slot_status } = req.body;
  if (!slot_number || !slot_status) {
    return res.status(400).json({ error: 'Missing slot information.' });
  }
  try {
    await pool.query(
      'INSERT INTO parking_slots (slot_number, slot_status) VALUES (?, ?)',
      [slot_number, slot_status]
    );
    res.status(201).json({ message: 'Parking slot created.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create parking slot.' });
  }
});

module.exports = router;
