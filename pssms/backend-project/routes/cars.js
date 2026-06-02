const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cars ORDER BY plate_number');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cars.' });
  }
});

router.post('/', async (req, res) => {
  const { plate_number, driver_name, phone_number } = req.body;
  if (!plate_number || !driver_name || !phone_number) {
    return res.status(400).json({ error: 'Missing car information.' });
  }
  try {
    await pool.query(
      'INSERT INTO cars (plate_number, driver_name, phone_number) VALUES (?, ?, ?)',
      [plate_number, driver_name, phone_number]
    );
    res.status(201).json({ message: 'Car created.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create car.' });
  }
});

module.exports = router;
