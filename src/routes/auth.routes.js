const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} = require('../validators/auth.validator');
const {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
} = require('../controllers/auth.controller');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', validate(refreshTokenSchema), refreshAccessToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
