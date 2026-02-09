const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config/config');
const { roleRights } = require('../config/roles');
const AppError = require('../utils/AppError');
const User = require('../models/user.model');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, info) => {
  if (err || info || !req.user) {
    return reject(new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  if (requiredRights.length) {
    const userRights = roleRights.get(req.user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== req.user.id) {
      return reject(new AppError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return next(new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  const token = req.headers.authorization.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(payload.sub);
    if (!user) {
       return next(new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
    
    if (requiredRights.length) {
        const userRights = roleRights.get(req.user.role) || [];
        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
        if (!hasRequiredRights) {
             return next(new AppError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
    }

    next();
  } catch (error) {
    next(new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
};

module.exports = auth;
