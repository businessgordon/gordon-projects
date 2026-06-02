const express = require('express');
const { protect } = require('../middleware/auth');
const { dailyReport, summaryReport, stats } = require('../controllers/reportController');
const router = express.Router();

router.use(protect);
router.get('/daily', dailyReport);
router.get('/summary', summaryReport);
router.get('/stats', stats);

module.exports = router;
