const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden-error');
const BadRequest = require('../errors/bad-request-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      const currentUserMovies = movies.filter((movie) => movie.owner.toString() === req.user._id);
      return currentUserMovies;
    })
    .then((currentUserMovies) => {
      if (currentUserMovies.length < 1) {
        res.send({ message: 'В вашей коллекции нет сохраненных фильмов' });
      } else {
        res.send({ data: currentUserMovies });
      }
    })
    .catch(next);
};

module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id })
    .then((movie) => res.send({ data: movie }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при сохранении фильма'));
      }
      next(error);
    });
};

module.exports.removeMovies = (req, res, next) => {
  Movie.findOne({ _id: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным id не найден');
      }
      return movie;
    })
    .then((foundMovie) => {
      if (foundMovie.owner.toString() === req.user._id) {
        return Movie.findByIdAndRemove(req.params.movieId)
          .then((remoteMovie) => {
            res.send({ data: remoteMovie });
          })
          .catch(next);
      }
      throw new Forbidden('Нет полномочий для удаления данного фильма');
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundError('Фильм с указанным id не найден'));
      }
      next(error);
    });
};
