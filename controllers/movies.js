/* eslint-disable consistent-return */
const Movie = require('../models/movies');
const NotFoundError = require('../errors/not-found-error');
const InternalServer = require('../errors/internal-server-error');
const Forbidden = require('../errors/forbidden-error');
const { CREATED_STATUS } = require('../utils/status');

module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movie) => {
      movie.reverse();
      res.send({ data: movie });
    })
    .catch(() => next(new InternalServer('Произошла ошибка')));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(CREATED_STATUS).send({ data: movie }))
    .catch(() => next(new InternalServer()));
};

module.exports.deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  const movieFound = await Movie.findById(movieId).lean();
  if (!movieFound) {
    return next(new NotFoundError('Неверные данные'));
  }
  const movieOwner = movieFound.owner.valueOf();
  if (userId !== movieOwner) {
    return next(new Forbidden('Это не ваш фильм'));
  }
  Movie.deleteOne(movieFound)
    .then((movie) => res.send({ data: movie }))
    .catch(() => next(new InternalServer()));
};
