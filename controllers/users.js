const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_DEV } = require('../config');
const User = require('../models/user');

const Unauthorized = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request-error');
const Conflict = require('../errors/conflict-error');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
        { expiresIn: '7d' },
      );

      return res.send({ token });
    })
    .catch(() => {
      next(new Unauthorized('Неправильные почта или пароль'));
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(({ name, email }) => {
      res.send({ data: { name, email } });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при регистрации пользователя'));
      }
      if (error.name === 'MongoError' && error.code === 11000) {
        next(new Conflict('Пользователь с таким email уже зарегистрирован'));
      }
      next(error);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      next(error);
    });
};
