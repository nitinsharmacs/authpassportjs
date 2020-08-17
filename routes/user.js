const router = require('express').Router();

const controllers = require('../controllers/user');

router.get('/', controllers.getUser);

module.exports = router;