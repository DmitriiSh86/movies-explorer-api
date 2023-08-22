const router = require('express').Router();

const { logOut } = require('../controllers/users');

router.get('/', logOut);

module.exports = router;
