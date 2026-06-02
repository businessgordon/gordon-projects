const pool = require('../config/database');

// Get all stock-out records
const getAllStockOut = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [stockOutRecords] = await connection.query(`
      SELECT so.stockOutId, so.sparePartId, sp.name, sp.category, so.stockOutQuantity, 
             so.stockOutUnitPrice, so.stockOutTotalPrice, so.stockOutDate, so.userId, u.username
      FROM stock_out so
      JOIN spare_part sp ON so.sparePartId = sp.sparePartId
      JOIN users u ON so.userId = u.userId
      ORDER BY so.stockOutDate DESC
    `);
    connection.release();

    res.status(200).json(stockOutRecords);
  } catch (error) {
    console.error('Get stock out error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get stock-out by ID
const getStockOutById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [stockOutRecords] = await connection.query(`
      SELECT so.stockOutId, so.sparePartId, sp.name, sp.category, so.stockOutQuantity, 
             so.stockOutUnitPrice, so.stockOutTotalPrice, so.stockOutDate, so.userId, u.username
      FROM stock_out so
      JOIN spare_part sp ON so.sparePartId = sp.sparePartId
      JOIN users u ON so.userId = u.userId
      WHERE so.stockOutId = ?
    `, [id]);
    connection.release();

    if (stockOutRecords.length === 0) {
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    res.status(200).json(stockOutRecords[0]);
  } catch (error) {
    console.error('Get stock out error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create stock-out record
const createStockOut = async (req, res) => {
  try {
    const { sparePartId, stockOutQuantity, stockOutUnitPrice, stockOutDate } = req.body;
    const userId = req.session.userId;

    if (!sparePartId || !stockOutQuantity || !stockOutUnitPrice || !stockOutDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const stockOutTotalPrice = stockOutQuantity * stockOutUnitPrice;
    const connection = await pool.getConnection();

    // Check if spare part exists and has sufficient quantity
    const [spareParts] = await connection.query('SELECT sparePartId, quantity FROM spare_part WHERE sparePartId = ?', [sparePartId]);
    
    if (spareParts.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Spare part not found' });
    }

    if (spareParts[0].quantity < stockOutQuantity) {
      connection.release();
      return res.status(400).json({ message: 'Insufficient quantity in stock' });
    }

    // Insert stock-out record
    const [result] = await connection.query(
      'INSERT INTO stock_out (sparePartId, userId, stockOutQuantity, stockOutUnitPrice, stockOutTotalPrice, stockOutDate) VALUES (?, ?, ?, ?, ?, ?)',
      [sparePartId, userId, stockOutQuantity, stockOutUnitPrice, stockOutTotalPrice, stockOutDate]
    );

    // Update spare part quantity
    const newQuantity = spareParts[0].quantity - stockOutQuantity;
    await connection.query('UPDATE spare_part SET quantity = ? WHERE sparePartId = ?', [newQuantity, sparePartId]);

    connection.release();

    res.status(201).json({ 
      message: 'Stock out record created successfully',
      stockOutId: result.insertId
    });
  } catch (error) {
    console.error('Create stock out error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update stock-out record
const updateStockOut = async (req, res) => {
  try {
    const { id } = req.params;
    const { sparePartId, stockOutQuantity, stockOutUnitPrice, stockOutDate } = req.body;

    if (!sparePartId || !stockOutQuantity || !stockOutUnitPrice || !stockOutDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const stockOutTotalPrice = stockOutQuantity * stockOutUnitPrice;
    const connection = await pool.getConnection();

    // Get current stock-out record
    const [currentRecords] = await connection.query('SELECT stockOutQuantity, sparePartId FROM stock_out WHERE stockOutId = ?', [id]);
    
    if (currentRecords.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    const currentRecord = currentRecords[0];
    const quantityDifference = stockOutQuantity - currentRecord.stockOutQuantity;

    // Check if spare part exists
    const [spareParts] = await connection.query('SELECT sparePartId, quantity FROM spare_part WHERE sparePartId = ?', [sparePartId]);
    
    if (spareParts.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Spare part not found' });
    }

    // Check if there's enough quantity for the difference
    if (quantityDifference > 0 && spareParts[0].quantity < quantityDifference) {
      connection.release();
      return res.status(400).json({ message: 'Insufficient quantity in stock' });
    }

    // Update stock-out record
    const [result] = await connection.query(
      'UPDATE stock_out SET sparePartId = ?, stockOutQuantity = ?, stockOutUnitPrice = ?, stockOutTotalPrice = ?, stockOutDate = ? WHERE stockOutId = ?',
      [sparePartId, stockOutQuantity, stockOutUnitPrice, stockOutTotalPrice, stockOutDate, id]
    );

    // Update spare part quantity
    const newQuantity = spareParts[0].quantity - quantityDifference;
    await connection.query('UPDATE spare_part SET quantity = ? WHERE sparePartId = ?', [newQuantity, sparePartId]);

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    res.status(200).json({ message: 'Stock out record updated successfully' });
  } catch (error) {
    console.error('Update stock out error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete stock-out record
const deleteStockOut = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    // Get stock-out record
    const [stockOutRecords] = await connection.query(
      'SELECT stockOutId, sparePartId, stockOutQuantity FROM stock_out WHERE stockOutId = ?', 
      [id]
    );
    
    if (stockOutRecords.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    const stockOutRecord = stockOutRecords[0];

    // Delete stock-out record
    await connection.query('DELETE FROM stock_out WHERE stockOutId = ?', [id]);

    // Update spare part quantity (add back the quantity)
    const [spareParts] = await connection.query('SELECT quantity FROM spare_part WHERE sparePartId = ?', [stockOutRecord.sparePartId]);
    const newQuantity = spareParts[0].quantity + stockOutRecord.stockOutQuantity;
    await connection.query('UPDATE spare_part SET quantity = ? WHERE sparePartId = ?', [newQuantity, stockOutRecord.sparePartId]);

    connection.release();

    res.status(200).json({ message: 'Stock out record deleted successfully' });
  } catch (error) {
    console.error('Delete stock out error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getAllStockOut, 
  getStockOutById, 
  createStockOut, 
  updateStockOut, 
  deleteStockOut 
};
