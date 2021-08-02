const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden-error');
const BadRequest = require('../errors/bad-request-error');
const {
  NO_MOVIES,
  SAVING_ERROR,
  MOVIE_ID_NOT_FOUND,
  NO_AUTHORITY,
} = require('../constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      const currentUserMovies = movies.filter((movie) => movie.owner.toString() === req.user._id);
      return currentUserMovies;
    })
    .then((currentUserMovies) => {
      if (currentUserMovies.length < 1) {
        res.send({ message: NO_MOVIES });
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
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest(SAVING_ERROR));
      }
      next(error);
    });
};

module.exports.removeMovies = (req, res, next) => {
  Movie.findOne({ _id: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MOVIE_ID_NOT_FOUND);
      }
      return movie;
    })
    .then((foundMovie) => {
      if (foundMovie.owner.toString() === req.user._id) {
        return foundMovie.remove()
          .then((remoteMovie) => {
            res.send({ data: remoteMovie });
          })
          .catch(next);
      }
      throw new Forbidden(NO_AUTHORITY);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundError(MOVIE_ID_NOT_FOUND));
      }
      next(error);
    });
};
