const db = require('../config/db');

async function createSalary(req, res) {
  const { employeeNumber, departmentCode, grossSalary, totalDeduction, month } = req.body;
  if (!employeeNumber || !departmentCode || !grossSalary || totalDeduction === undefined || !month) {
    return res.status(400).json({ message: 'Required salary fields are missing' });
  }

  try {
    const netSalary = Number(grossSalary) - Number(totalDeduction);
    await db.query(
      'INSERT INTO Salary (employeeNumber, departmentCode, grossSalary, totalDeduction, netSalary, month) VALUES (?, ?, ?, ?, ?, ?)',
      [employeeNumber, departmentCode, grossSalary, totalDeduction, netSalary, month]
    );

    return res.status(201).json({ message: 'Salary record created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to create salary record' });
  }
}

async function getSalaries(req, res) {
  const { month } = req.query;
  try {
    const query = month ? 'SELECT * FROM Salary WHERE month = ?' : 'SELECT * FROM Salary';
    const [rows] = month ? await db.query(query, [month]) : await db.query(query);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch salaries' });
  }
}

async function updateSalary(req, res) {
  const { id } = req.params;
  const { grossSalary, totalDeduction, month } = req.body;
  if (!grossSalary || totalDeduction === undefined || !month) {
    return res.status(400).json({ message: 'Required salary fields are missing' });
  }

  try {
    const netSalary = Number(grossSalary) - Number(totalDeduction);
    const [result] = await db.query(
      'UPDATE Salary SET grossSalary = ?, totalDeduction = ?, netSalary = ?, month = ? WHERE salaryId = ?',
      [grossSalary, totalDeduction, netSalary, month, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    return res.json({ message: 'Salary record updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to update salary record' });
  }
}

async function deleteSalary(req, res) {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM Salary WHERE salaryId = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    return res.json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete salary record' });
  }
}

module.exports = { createSalary, getSalaries, updateSalary, deleteSalary };
