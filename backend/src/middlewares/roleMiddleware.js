const AppError = require('../utils/AppError');

const roleMiddleware = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('Access denied: insufficient permissions', 403));
  }

  next();
};

module.exports = roleMiddleware;
