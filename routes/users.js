const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  updateProfile, getMe,
} = require('../controllers/users');
const { regexEmail } = require('../utils/regex');

router.get('/me', getMe);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().pattern(regexEmail),
  }),
}), updateProfile);

module.exports = router;
