const express = require('express');
const { createEmployee, getEmployees, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(ensureAuthenticated);
router.post('/', createEmployee);
router.get('/', getEmployees);
router.put('/:employeeNumber', updateEmployee);
router.delete('/:employeeNumber', deleteEmployee);

module.exports = router;
