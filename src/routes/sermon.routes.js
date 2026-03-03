const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createSermonSchema,
  updateSermonSchema,
} = require('../validators/sermon.validator');
const sermonController = require('../controllers/sermon.controller');

// Public routes
router.get('/', sermonController.getAll);
router.get('/search', sermonController.search);
router.get('/recent', sermonController.getRecent);
router.get('/featured', sermonController.getFeatured);
router.get('/series', sermonController.getAllSeries);
router.get('/series/:series', sermonController.getBySeries);
router.get('/preacher/:name', sermonController.getByPreacher);
router.get('/:id', sermonController.getById);

// Protected routes
router.post('/:id/favorite', protect, sermonController.toggleFavorite);
router.post('/:id/play', optionalAuth, sermonController.incrementPlayCount);

// Admin routes
router.post('/', protect, isAdmin, validate(createSermonSchema), sermonController.create);
router.put('/:id', protect, isAdmin, validate(updateSermonSchema), sermonController.update);
router.delete('/:id', protect, isAdmin, sermonController.delete);

module.exports = router;
