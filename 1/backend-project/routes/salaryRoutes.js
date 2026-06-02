const express = require('express');
const { createSalary, getSalaries, updateSalary, deleteSalary } = require('../controllers/salaryController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(ensureAuthenticated);
router.post('/', createSalary);
router.get('/', getSalaries);
router.put('/:id', updateSalary);
router.delete('/:id', deleteSalary);

module.exports = router;
