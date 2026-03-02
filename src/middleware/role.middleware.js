const ApiError = require('../utils/ApiError');

// Restrict access to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }

    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Not authenticated'));
  }

  if (req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'));
  }

  next();
};

module.exports = { restrictTo, isAdmin };
