const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { createUser } = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(3).required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

module.exports = router;
