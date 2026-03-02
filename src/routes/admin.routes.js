const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  updateUserRoleSchema,
  updateUserStatusSchema,
} = require('../validators/user.validator');
const {
  getDashboard,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  getUserDetails,
} = require('../controllers/admin.controller');

// All routes require admin access
router.use(protect, isAdmin);

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/role', validate(updateUserRoleSchema), updateUserRole);
router.put('/users/:id/status', validate(updateUserStatusSchema), updateUserStatus);

module.exports = router;
