const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const router = Router();
const { login } = require('../controllers/users');
const { INCORRECT_EMAIL } = require('../constants');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message(INCORRECT_EMAIL);
    }),
    password: Joi.string().required().min(8),
  }),
}), login);

module.exports = router;
