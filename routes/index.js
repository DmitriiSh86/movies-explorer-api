const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const signinRouter = require('./signin');
const signupRouter = require('./signup');
const logoutRouter = require('./logout');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

router.use('/signin', signinRouter);
router.use('/signup', signupRouter);
router.use(auth);
router.use('/signout', logoutRouter);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => next(new NotFoundError('Такого адреса не существует')));

module.exports = router;
