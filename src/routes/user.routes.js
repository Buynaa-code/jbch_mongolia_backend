const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  updateProfileSchema,
  changePasswordSchema,
} = require('../validators/user.validator');
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllFavorites,
  getFavoriteSongs,
  getFavoriteVerses,
} = require('../controllers/user.controller');

// All routes are protected
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.put('/change-password', validate(changePasswordSchema), changePassword);

router.get('/favorites', getAllFavorites);
router.get('/favorites/songs', getFavoriteSongs);
router.get('/favorites/verses', getFavoriteVerses);

module.exports = router;
