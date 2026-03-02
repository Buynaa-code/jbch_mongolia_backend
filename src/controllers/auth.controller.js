const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../middleware/auth.middleware');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(ApiError.conflict('Email already registered'));
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  ApiResponse.created(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  }, 'Registration successful');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(ApiError.unauthorized('Invalid email or password'));
  }

  if (!user.isActive) {
    return next(ApiError.forbidden('Account is deactivated'));
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  ApiResponse.success(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  }, 'Login successful');
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(ApiError.badRequest('Refresh token is required'));
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    return next(ApiError.unauthorized('Invalid or expired refresh token'));
  }

  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    return next(ApiError.unauthorized('Invalid refresh token'));
  }

  if (!user.isActive) {
    return next(ApiError.forbidden('Account is deactivated'));
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  ApiResponse.success(res, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  }, 'Token refreshed successfully');
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Protected
const logout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }

  ApiResponse.success(res, null, 'Logout successful');
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Protected
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate('favoriteSongs', 'title artist')
    .populate('favoriteVerses', 'reference text')
    .populate('registeredEvents', 'title startDate');

  ApiResponse.success(res, { user });
});

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
};
