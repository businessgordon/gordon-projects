const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/serviceController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, ServiceController.getAll);
router.get('/:code', requireAuth, ServiceController.getOne);
router.post('/', requireAuth, ServiceController.create);
router.put('/:code', requireAuth, ServiceController.update);
router.delete('/:code', requireAuth, ServiceController.delete);

module.exports = router;
