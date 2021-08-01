const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const router = Router();
const { createUser } = require('../controllers/users');
const { INCORRECT_EMAIL } = require('../constants');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message(INCORRECT_EMAIL);
    }),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = router;
