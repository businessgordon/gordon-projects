const db = require('../config/db');

async function createDepartment(req, res) {
  const { departmentCode, departmentName, grossSalary, totalDeduction } = req.body;
  if (!departmentCode || !departmentName || !grossSalary || totalDeduction === undefined) {
    return res.status(400).json({ message: 'Required department fields are missing' });
  }

  try {
    const [exists] = await db.query('SELECT departmentCode FROM Department WHERE departmentCode = ?', [departmentCode]);
    if (exists.length) {
      return res.status(409).json({ message: 'Department code already exists' });
    }

    await db.query(
      'INSERT INTO Department (departmentCode, departmentName, grossSalary, totalDeduction) VALUES (?, ?, ?, ?)',
      [departmentCode, departmentName, grossSalary, totalDeduction]
    );

    return res.status(201).json({ message: 'Department created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to create department' });
  }
}

async function getDepartments(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM Department');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch departments' });
  }
}
// Update and delete handlers

async function updateDepartment(req, res) {
  const { code } = req.params;
  const { departmentName, grossSalary, totalDeduction } = req.body;
  if (!departmentName || grossSalary === undefined || totalDeduction === undefined) {
    return res.status(400).json({ message: 'Required department fields are missing' });
  }
  try {
    const [result] = await db.query('UPDATE Department SET departmentName = ?, grossSalary = ?, totalDeduction = ? WHERE departmentCode = ?', [departmentName, grossSalary, totalDeduction, code]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    return res.json({ message: 'Department updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to update department' });
  }
}

async function deleteDepartment(req, res) {
  const { code } = req.params;
  try {
    const [result] = await db.query('DELETE FROM Department WHERE departmentCode = ?', [code]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    return res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete department' });
  }
}

module.exports = { createDepartment, getDepartments, updateDepartment, deleteDepartment };
