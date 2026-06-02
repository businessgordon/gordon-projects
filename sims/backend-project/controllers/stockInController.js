const pool = require('../config/database');

// Get all stock-in records
const getAllStockIn = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [stockInRecords] = await connection.query(`
      SELECT si.stockInId, si.sparePartId, sp.name, sp.category, si.stockInQuantity, 
             sp.unitPrice, (si.stockInQuantity * sp.unitPrice) as totalPrice, si.stockInDate
      FROM stock_in si
      JOIN spare_part sp ON si.sparePartId = sp.sparePartId
      ORDER BY si.stockInDate DESC
    `);
    connection.release();

    res.status(200).json(stockInRecords);
  } catch (error) {
    console.error('Get stock in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get stock-in by ID
const getStockInById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [stockInRecords] = await connection.query(`
      SELECT si.stockInId, si.sparePartId, sp.name, sp.category, si.stockInQuantity, 
             sp.unitPrice, (si.stockInQuantity * sp.unitPrice) as totalPrice, si.stockInDate
      FROM stock_in si
      JOIN spare_part sp ON si.sparePartId = sp.sparePartId
      WHERE si.stockInId = ?
    `, [id]);
    connection.release();

    if (stockInRecords.length === 0) {
      return res.status(404).json({ message: 'Stock in record not found' });
    }

    res.status(200).json(stockInRecords[0]);
  } catch (error) {
    console.error('Get stock in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create stock-in record
const createStockIn = async (req, res) => {
  try {
    const { sparePartId, stockInQuantity, stockInDate } = req.body;

    if (!sparePartId || !stockInQuantity || !stockInDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const connection = await pool.getConnection();

    // Check if spare part exists
    const [spareParts] = await connection.query('SELECT sparePartId, quantity FROM spare_part WHERE sparePartId = ?', [sparePartId]);
    
    if (spareParts.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Spare part not found' });
    }

    // Insert stock-in record
    const [result] = await connection.query(
      'INSERT INTO stock_in (sparePartId, stockInQuantity, stockInDate) VALUES (?, ?, ?)',
      [sparePartId, stockInQuantity, stockInDate]
    );

    // Update spare part quantity
    const newQuantity = spareParts[0].quantity + stockInQuantity;
    await connection.query('UPDATE spare_part SET quantity = ? WHERE sparePartId = ?', [newQuantity, sparePartId]);

    connection.release();

    res.status(201).json({ 
      message: 'Stock in record created successfully',
      stockInId: result.insertId
    });
  } catch (error) {
    console.error('Create stock in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getAllStockIn, 
  getStockInById, 
  createStockIn 
};
