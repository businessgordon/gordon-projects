const { pool } = require('../config/db');

async function dailyReport(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  const [rows] = await pool.query(
    `SELECT s.record_number, s.plate_number, p.package_name, p.package_description, pay.amount_paid, pay.payment_date
     FROM ServicePackage s
     LEFT JOIN Packages p ON s.package_number = p.package_number
     LEFT JOIN Payment pay ON s.record_number = pay.record_number
     WHERE DATE(s.service_date) = ?
     ORDER BY pay.payment_date DESC`,
    [today]
  );
  res.json(rows);
}

async function summaryReport(req, res) {
  const { period = 'monthly' } = req.query;
  let interval = 'MONTH';
  if (period === 'weekly') interval = 'WEEK';
  if (period === 'daily') interval = 'DAY';

  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(payment_date, '%Y-%m-%d') as label,
        SUM(amount_paid) as revenue,
        COUNT(*) as transactions
      FROM Payment
      GROUP BY ${interval}(payment_date), DATE(payment_date)
      ORDER BY DATE(payment_date) DESC
      LIMIT 12`
  );
  res.json(rows);
}

async function stats(req, res) {
  const [[totalCars]] = await pool.query('SELECT COUNT(*) as value FROM Cars');
  const [[pendingPayments]] = await pool.query("SELECT COUNT(*) as value FROM Payment WHERE payment_status = 'Pending'");
  const [[completedWashes]] = await pool.query("SELECT COUNT(*) as value FROM ServicePackage WHERE status = 'Completed'");
  const [[todayWashes]] = await pool.query("SELECT COUNT(*) as value FROM ServicePackage WHERE DATE(service_date) = CURDATE()");
  const [[revenue]] = await pool.query('SELECT IFNULL(SUM(amount_paid), 0) as value FROM Payment');
  const [topPackages] = await pool.query(
    `SELECT p.package_name, COUNT(*) as sold
     FROM ServicePackage s
     JOIN Packages p ON s.package_number = p.package_number
     GROUP BY p.package_name
     ORDER BY sold DESC
     LIMIT 5`
  );

  res.json({
    totalCars: totalCars.value,
    pendingPayments: pendingPayments.value,
    completedWashes: completedWashes.value,
    todayWashes: todayWashes.value,
    totalRevenue: revenue.value,
    topPackages,
  });
}

module.exports = { dailyReport, summaryReport, stats };
