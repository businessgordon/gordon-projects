const express = require('express');
const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(ensureAuthenticated);
router.post('/', createDepartment);
router.get('/', getDepartments);
router.put('/:code', updateDepartment);
router.delete('/:code', deleteDepartment);

module.exports = router;
