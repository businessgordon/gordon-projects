const express = require('express');
const { payrollReport } = require('../controllers/reportController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(ensureAuthenticated);
router.get('/', payrollReport);

module.exports = router;
