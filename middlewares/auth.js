const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized-error');
const { JWT_SECRET } = require('../config');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
