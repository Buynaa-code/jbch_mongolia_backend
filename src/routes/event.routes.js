const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createEventSchema,
  updateEventSchema,
} = require('../validators/event.validator');
const eventController = require('../controllers/event.controller');

// Public routes
router.get('/', eventController.getAll);
router.get('/upcoming', eventController.getUpcoming);
router.get('/featured', eventController.getFeatured);
router.get('/type/:type', eventController.getByType);
router.get('/:id', eventController.getById);

// Protected routes
router.post('/:id/register', protect, eventController.registerForEvent);
router.delete('/:id/register', protect, eventController.unregisterFromEvent);

// Admin routes
router.post('/', protect, isAdmin, validate(createEventSchema), eventController.create);
router.put('/:id', protect, isAdmin, validate(updateEventSchema), eventController.update);
router.delete('/:id', protect, isAdmin, eventController.delete);

module.exports = router;
