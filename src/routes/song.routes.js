const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createSongSchema,
  updateSongSchema,
} = require('../validators/song.validator');
const songController = require('../controllers/song.controller');

// Public routes
router.get('/', songController.getAll);
router.get('/search', songController.search);
router.get('/popular', songController.getPopular);
router.get('/featured', songController.getFeatured);
router.get('/genre/:genre', songController.getByGenre);
router.get('/:id', songController.getById);

// Protected routes
router.post('/:id/favorite', protect, songController.toggleFavorite);
router.post('/:id/play', optionalAuth, songController.incrementPlayCount);

// Admin routes
router.post('/', protect, isAdmin, validate(createSongSchema), songController.create);
router.put('/:id', protect, isAdmin, validate(updateSongSchema), songController.update);
router.delete('/:id', protect, isAdmin, songController.delete);

module.exports = router;
