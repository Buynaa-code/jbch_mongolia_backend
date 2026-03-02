const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createVerseSchema,
  updateVerseSchema,
  setVerseOfWeekSchema,
} = require('../validators/verse.validator');
const verseController = require('../controllers/verse.controller');

// Public routes
router.get('/', verseController.getAll);
router.get('/verse-of-week', verseController.getVerseOfWeek);
router.get('/themes', verseController.getThemes);
router.get('/theme/:theme', verseController.getByTheme);
router.get('/book/:book', verseController.getByBook);
router.get('/:id', verseController.getById);

// Protected routes
router.post('/:id/favorite', protect, verseController.toggleFavorite);

// Admin routes
router.post('/', protect, isAdmin, validate(createVerseSchema), verseController.create);
router.put('/:id', protect, isAdmin, validate(updateVerseSchema), verseController.update);
router.put(
  '/:id/set-verse-of-week',
  protect,
  isAdmin,
  validate(setVerseOfWeekSchema),
  verseController.setVerseOfWeek
);
router.delete('/:id', protect, isAdmin, verseController.delete);

module.exports = router;
