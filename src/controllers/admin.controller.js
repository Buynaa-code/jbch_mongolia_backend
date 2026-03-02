const User = require('../models/User.model');
const Event = require('../models/Event.model');
const Song = require('../models/Song.model');
const Verse = require('../models/Verse.model');
const Program = require('../models/Program.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
const getDashboard = asyncHandler(async (req, res, next) => {
  const [
    totalUsers,
    activeUsers,
    totalEvents,
    upcomingEvents,
    totalSongs,
    totalVerses,
    totalPrograms,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Event.countDocuments(),
    Event.countDocuments({ startDate: { $gt: new Date() }, isActive: true }),
    Song.countDocuments({ isActive: true }),
    Verse.countDocuments({ isActive: true }),
    Program.countDocuments({ isActive: true }),
    User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt'),
  ]);

  ApiResponse.success(res, {
    statistics: {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
      },
      content: {
        songs: totalSongs,
        verses: totalVerses,
        programs: totalPrograms,
      },
    },
    recentUsers,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const { role, isActive, search } = req.query;

  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v'),
    User.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, users, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  // Prevent changing own role
  if (req.params.id === req.user._id.toString()) {
    return next(ApiError.badRequest('Cannot change your own role'));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(ApiError.notFound('User not found'));
  }

  ApiResponse.success(res, { user }, 'User role updated successfully');
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
const updateUserStatus = asyncHandler(async (req, res, next) => {
  const { isActive } = req.body;

  // Prevent deactivating own account
  if (req.params.id === req.user._id.toString()) {
    return next(ApiError.badRequest('Cannot change your own status'));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  );

  if (!user) {
    return next(ApiError.notFound('User not found'));
  }

  ApiResponse.success(
    res,
    { user },
    `User ${isActive ? 'activated' : 'deactivated'} successfully`
  );
});

// @desc    Get user details (admin)
// @route   GET /api/admin/users/:id
const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('favoriteSongs', 'title artist')
    .populate('favoriteVerses', 'reference')
    .populate('registeredEvents', 'title startDate');

  if (!user) {
    return next(ApiError.notFound('User not found'));
  }

  ApiResponse.success(res, { user });
});

module.exports = {
  getDashboard,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  getUserDetails,
};
