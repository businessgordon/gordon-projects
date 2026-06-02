const db = require('../config/db');

async function createEmployee(req, res) {
  const {
    employeeNumber,
    firstName,
    lastName,
    position,
    address,
    telephone,
    gender,
    hiredDate,
    departmentCode,
  } = req.body;

  if (!employeeNumber || !firstName || !lastName || !position || !telephone || !departmentCode) {
    return res.status(400).json({ message: 'Required employee fields are missing' });
  }

  try {
    const [exists] = await db.query('SELECT employeeNumber FROM Employee WHERE employeeNumber = ?', [employeeNumber]);
    if (exists.length) {
      return res.status(409).json({ message: 'Employee number already exists' });
    }

    await db.query(
      'INSERT INTO Employee (employeeNumber, firstName, lastName, position, address, telephone, gender, hiredDate, departmentCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [employeeNumber, firstName, lastName, position, address, telephone, gender, hiredDate, departmentCode]
    );

    return res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to create employee' });
  }
}

async function getEmployees(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM Employee');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch employees' });
  }
}

// Update and delete handlers

async function updateEmployee(req, res) {
  const { employeeNumber } = req.params;
  const {
    firstName,
    lastName,
    position,
    address,
    telephone,
    gender,
    hiredDate,
    departmentCode,
  } = req.body;

  if (!firstName || !lastName || !position || !telephone) {
    return res.status(400).json({ message: 'Required employee fields are missing' });
  }

  try {
    const [result] = await db.query(
      `UPDATE Employee SET firstName = ?, lastName = ?, position = ?, address = ?, telephone = ?, gender = ?, hiredDate = ?, departmentCode = ? WHERE employeeNumber = ?`,
      [firstName, lastName, position, address, telephone, gender, hiredDate, departmentCode, employeeNumber]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to update employee' });
  }
}

async function deleteEmployee(req, res) {
  const { employeeNumber } = req.params;
  try {
    const [result] = await db.query('DELETE FROM Employee WHERE employeeNumber = ?', [employeeNumber]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete employee' });
  }
}

module.exports = { createEmployee, getEmployees, updateEmployee, deleteEmployee };
