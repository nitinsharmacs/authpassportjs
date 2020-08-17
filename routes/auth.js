const router = require('express').Router();
const passport = require('passport');

const controllers = require('../controllers/auth');


router.post('/login', (req, res, next)=>{
	passport.authenticate('local-login', {session:false}, (err, user, info)=>{
		req.user = user;req.err = err;req.info=info;
		return next();
	})(req, res, next);
}, controllers.localLogin);

router.post('/register', (req, res, next) => {
	passport.authenticate('local-register', {session:false}, (err, user, info)=>{
		req.user = user;req.err = err;req.info=info;
		return next();
	})(req, res, next);
}, controllers.localRegister);

router.get('/facebook', passport.authenticate('fb-login'));

router.get('/facebook/redirect', (req, res, next)=>{
	passport.authenticate('fb-login', {session:false}, (err,  user, info)=>{
		req.user=user;req.err=err;req.info=info;
		return next();
	})(req, res, next);
} , controllers.fbLogin)

router.get('/google', passport.authenticate('google-login', {scope:['https://www.googleapis.com/auth/plus.login', 'profile', 'email']}));

router.get('/google/redirect', (req, res, next)=>{
	passport.authenticate('google-login', {session:false}, (err, user, info)=>{
		console.log(user)
		req.user = user;req.err=err;req.info=info;
		return next();
	})(req, res, next);
} ,controllers.googleLogin);

router.get('/twitter', passport.authenticate('twitter-login', {session:false}));

router.get('/twitter/redirect', (req, res, next) => {
	passport.authenticate('twitter-login', {session:false}, (err, user, info) => {
		req.user = user;req.err=err;req.info=info;
		return next();
	})(req, res, next);
} , controllers.twitterLogin);

module.exports = router;