const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { regexUrl } = require('../utils/regex');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
    image: Joi.string().required().pattern(regexUrl),
    trailer: Joi.string().required().pattern(regexUrl),
    thumbnail: Joi.string().required().pattern(regexUrl),
    movieId: Joi.number().required(),
    duration: Joi.number().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
