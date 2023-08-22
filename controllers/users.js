const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request-error');
const InternalServer = require('../errors/internal-server-error');
const Unauthorized = require('../errors/unauthorized-error');
const Conflict = require('../errors/conflict-error');
const { CREATED_STATUS } = require('../utils/status');
const { JWT_SECRET } = require('../config');

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(CREATED_STATUS).send({
      user: {
        _id: user._id, name: user.name, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некоректные данные'));
      }
      if (err.code === 11000) {
        return next(new Conflict('Пользователь с текущим email уже занят'));
      }
      return next(new InternalServer());
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
      });
      return res.send({ user: payload });
    })
    .catch(() => next(new Unauthorized('Неверные данные')));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некоректные данные'));
      }
      return next(new InternalServer());
    });
};

module.exports.getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError('Пользоваетеля с таким id нет'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        return next(err);
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданный id некорректен'));
      }
      return next(new InternalServer());
    });
};

module.exports.logOut = (req, res) => res.clearCookie('jwt').send({ message: 'LogOut' });
