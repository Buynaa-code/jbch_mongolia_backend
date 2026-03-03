const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user profile
// @route   GET /api/users/profile
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate('favoriteSongs', 'title artist coverImage')
    .populate('favoriteVerses', 'reference text theme')
    .populate('favoriteSermons', 'title preacher thumbnailUrl')
    .populate('registeredEvents', 'title startDate location');

  ApiResponse.success(res, { user });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, phone, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  );

  ApiResponse.success(res, { user }, 'Profile updated successfully');
});

// @desc    Change password
// @route   PUT /api/users/change-password
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(ApiError.unauthorized('Current password is incorrect'));
  }

  user.password = newPassword;
  await user.save();

  ApiResponse.success(res, null, 'Password changed successfully');
});

// @desc    Get all user favorites
// @route   GET /api/users/favorites
const getAllFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate('favoriteSongs', 'title artist coverImage genre')
    .populate('favoriteVerses', 'reference text theme book')
    .populate('favoriteSermons', 'title preacher date thumbnailUrl');

  ApiResponse.success(res, {
    songs: user.favoriteSongs,
    verses: user.favoriteVerses,
    sermons: user.favoriteSermons,
  });
});

// @desc    Get favorite songs
// @route   GET /api/users/favorites/songs
const getFavoriteSongs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.user._id);
  const total = user.favoriteSongs.length;

  const populatedUser = await User.findById(req.user._id).populate({
    path: 'favoriteSongs',
    options: { skip, limit },
    select: 'title artist coverImage genre playCount',
  });

  ApiResponse.paginated(res, populatedUser.favoriteSongs, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Get favorite verses
// @route   GET /api/users/favorites/verses
const getFavoriteVerses = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.user._id);
  const total = user.favoriteVerses.length;

  const populatedUser = await User.findById(req.user._id).populate({
    path: 'favoriteVerses',
    options: { skip, limit },
    select: 'reference text textMongolian theme book',
  });

  ApiResponse.paginated(res, populatedUser.favoriteVerses, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

// @desc    Get favorite sermons
// @route   GET /api/users/favorites/sermons
const getFavoriteSermons = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.user._id);
  const total = user.favoriteSermons.length;

  const populatedUser = await User.findById(req.user._id).populate({
    path: 'favoriteSermons',
    options: { skip, limit },
    select: 'title preacher date thumbnailUrl duration',
  });

  ApiResponse.paginated(res, populatedUser.favoriteSermons, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAllFavorites,
  getFavoriteSongs,
  getFavoriteVerses,
  getFavoriteSermons,
};
