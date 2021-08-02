const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const router = Router();
const { INCORRECT_EMAIL } = require('../constants');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message(INCORRECT_EMAIL);
    }),
  }),
}), updateUser);

module.exports = router;
