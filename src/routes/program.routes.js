const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createProgramSchema,
  updateProgramSchema,
} = require('../validators/program.validator');
const programController = require('../controllers/program.controller');

// Public routes
router.get('/', programController.getAll);
router.get('/current-week', programController.getCurrentWeek);
router.get('/day/:day', programController.getByDay);
router.get('/service/:type', programController.getByServiceType);
router.get('/:id', programController.getById);

// Admin routes
router.post('/', protect, isAdmin, validate(createProgramSchema), programController.create);
router.put('/:id', protect, isAdmin, validate(updateProgramSchema), programController.update);
router.post('/:id/clone', protect, isAdmin, programController.cloneForNextWeek);
router.delete('/:id', protect, isAdmin, programController.delete);

module.exports = router;
