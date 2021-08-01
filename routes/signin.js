const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');

const router = Router();
const { login } = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(5),
    password: Joi.string().required().min(8),
  }),
}), login);

module.exports = router;
