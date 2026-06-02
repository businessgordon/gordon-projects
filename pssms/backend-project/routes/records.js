const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pr.record_id, c.plate_number, c.driver_name, c.phone_number,
        ps.slot_number, pr.entry_time, pr.exit_time, pr.duration, p.amount_paid, p.payment_date
      FROM parking_records pr
      JOIN cars c ON pr.car_id = c.car_id
      JOIN parking_slots ps ON pr.slot_id = ps.slot_id
      LEFT JOIN payments p ON p.record_id = pr.record_id
      ORDER BY pr.entry_time DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch parking records.' });
  }
});

router.post('/', async (req, res) => {
  const { plate_number, slot_number, entry_time, exit_time } = req.body;
  if (!plate_number || !slot_number || !entry_time || !exit_time) {
    return res.status(400).json({ error: 'Missing parking record information.' });
  }
  try {
    const [cars] = await pool.query('SELECT car_id FROM cars WHERE plate_number = ?', [plate_number]);
    const [slots] = await pool.query('SELECT slot_id FROM parking_slots WHERE slot_number = ?', [slot_number]);
    if (cars.length === 0 || slots.length === 0) {
      return res.status(400).json({ error: 'Car or slot not found.' });
    }
    const car_id = cars[0].car_id;
    const slot_id = slots[0].slot_id;
    const duration = Math.max(0, (new Date(exit_time) - new Date(entry_time)) / 1000 / 3600);
    const rounded = Math.ceil(duration || 1);
    await pool.query(
      'INSERT INTO parking_records (car_id, slot_id, entry_time, exit_time, duration) VALUES (?, ?, ?, ?, ?)',
      [car_id, slot_id, entry_time, exit_time, rounded]
    );
    await pool.query('UPDATE parking_slots SET slot_status = ? WHERE slot_id = ?', ['available', slot_id]);
    res.status(201).json({ message: 'Parking record created.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create parking record.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { entry_time, exit_time, slot_number, plate_number } = req.body;
  try {
    const [recordRows] = await pool.query('SELECT * FROM parking_records WHERE record_id = ?', [id]);
    if (recordRows.length === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }
    const record = recordRows[0];
    const [carRows] = await pool.query('SELECT car_id FROM cars WHERE plate_number = ?', [plate_number]);
    const [slotRows] = await pool.query('SELECT slot_id FROM parking_slots WHERE slot_number = ?', [slot_number]);
    if (carRows.length === 0 || slotRows.length === 0) {
      return res.status(400).json({ error: 'Car or slot not found.' });
    }
    const duration = Math.max(0, (new Date(exit_time) - new Date(entry_time)) / 1000 / 3600);
    const rounded = Math.ceil(duration || 1);
    await pool.query(
      'UPDATE parking_records SET car_id = ?, slot_id = ?, entry_time = ?, exit_time = ?, duration = ? WHERE record_id = ?',
      [carRows[0].car_id, slotRows[0].slot_id, entry_time, exit_time, rounded, id]
    );
    res.json({ message: 'Parking record updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update parking record.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM parking_records WHERE record_id = ?', [id]);
    res.json({ message: 'Parking record deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete parking record.' });
  }
});

module.exports = router;
