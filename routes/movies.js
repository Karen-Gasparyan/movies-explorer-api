const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');

const router = Router();
const { IMAGE_REGEX } = require('../config');
const {
  getMovies,
  createMovies,
  removeMovies,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(IMAGE_REGEX),
    trailer: Joi.string().required().regex(IMAGE_REGEX),
    thumbnail: Joi.string().required().regex(IMAGE_REGEX),
    movieId: Joi.required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovies);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), removeMovies);

module.exports = router;
