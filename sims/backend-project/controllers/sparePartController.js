const pool = require('../config/database');

// Get all spare parts
const getAllSpareParts = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [spareParts] = await connection.query('SELECT * FROM spare_part ORDER BY sparePartId DESC');
    connection.release();

    res.status(200).json(spareParts);
  } catch (error) {
    console.error('Get spare parts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single spare part
const getSparePartById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [spareParts] = await connection.query('SELECT * FROM spare_part WHERE sparePartId = ?', [id]);
    connection.release();

    if (spareParts.length === 0) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    res.status(200).json(spareParts[0]);
  } catch (error) {
    console.error('Get spare part error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create spare part
const createSparePart = async (req, res) => {
  try {
    const { name, category, quantity, unitPrice } = req.body;

    // Validate input
    if (!name || !category || quantity === undefined || !unitPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const totalPrice = quantity * unitPrice;
    const connection = await pool.getConnection();

    // Check if spare part already exists
    const [existingPart] = await connection.query('SELECT sparePartId FROM spare_part WHERE name = ? AND category = ?', [name, category]);
    
    if (existingPart.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'Spare part already exists' });
    }

    // Insert spare part
    const [result] = await connection.query(
      'INSERT INTO spare_part (name, category, quantity, unitPrice, totalPrice) VALUES (?, ?, ?, ?, ?)',
      [name, category, quantity, unitPrice, totalPrice]
    );

    connection.release();

    res.status(201).json({ 
      message: 'Spare part created successfully',
      sparePartId: result.insertId
    });
  } catch (error) {
    console.error('Create spare part error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update spare part
const updateSparePart = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, unitPrice } = req.body;

    if (!name || !category || quantity === undefined || !unitPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const totalPrice = quantity * unitPrice;
    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'UPDATE spare_part SET name = ?, category = ?, quantity = ?, unitPrice = ?, totalPrice = ? WHERE sparePartId = ?',
      [name, category, quantity, unitPrice, totalPrice, id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    res.status(200).json({ message: 'Spare part updated successfully' });
  } catch (error) {
    console.error('Update spare part error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete spare part
const deleteSparePart = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [result] = await connection.query('DELETE FROM spare_part WHERE sparePartId = ?', [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    res.status(200).json({ message: 'Spare part deleted successfully' });
  } catch (error) {
    console.error('Delete spare part error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getAllSpareParts, 
  getSparePartById, 
  createSparePart, 
  updateSparePart, 
  deleteSparePart 
};
