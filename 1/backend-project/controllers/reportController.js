const db = require('../config/db');

async function payrollReport(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT e.firstName, e.lastName, e.position, d.departmentName AS department, s.netSalary, s.month
       FROM Salary s
       JOIN Employee e ON s.employeeNumber = e.employeeNumber
       JOIN Department d ON s.departmentCode = d.departmentCode
       ORDER BY s.month DESC, e.lastName ASC`
    );
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to generate payroll report' });
  }
}

module.exports = { payrollReport };
