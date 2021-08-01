const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');

const router = Router();
const { createUser } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().min(5),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = router;
