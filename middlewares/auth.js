const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_DEV } = require('../config');
const Unauthorized = require('../errors/unauthorized-error');
const {
  NOT_AUTHORIZED,
  NOT_AUTHORIZED_INVALID_JWT,
} = require('../constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized(NOT_AUTHORIZED);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
    );
  } catch (error) {
    next(new Unauthorized(NOT_AUTHORIZED_INVALID_JWT));
  }

  req.user = payload;

  next();
};
