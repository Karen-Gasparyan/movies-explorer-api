const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden-error');
const BadRequest = require('../errors/bad-request-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createMovies = (req, res, next) => {
  const { name, link } = req.body;

  Movie.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      }
      next(error);
    });
};

module.exports.removeMovies = (req, res, next) => {
  Movie.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      return card;
    })
    .then((foundCard) => {
      if (foundCard.owner.toString() === req.user._id) {
        return Movie.findByIdAndRemove(req.params.cardId)
          .then((remoteCard) => {
            res.send({ data: remoteCard });
          })
          .catch(next);
      }
      throw new Forbidden('Нет полномочий для удаления данной карточки');
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      next(error);
    });
};
