const router = require('express').Router();
const passport = require('passport');

const controllers = require('../controllers/auth');

router.post('/login', (req, res, next)=>{
	passport.authenticate('local-login', (err, user, info)=>{
		req.user = user; req.err = err;req.info = info;
		return next();
	})(req, res, next);
}, controllers.localLogin);


router.post('/register', (req, res, next) => {
	passport.authenticate('local-register', (err, user, info)=>{
		req.user = user;req.err = err;req.info=info;
		return next();
	})(req, res, next);
}, controllers.localRegister);

router.get('/facebook', passport.authenticate('fb-login'));

router.get('/facebook/redirect', passport.authenticate('fb-login', {
	successRedirect:process.env.REDIRECT,
	failuerRedirect:'/auth/facebook/failed'
}));

router.get('/facebook/failed', controllers.fbLoginFailed);


router.get('/google', passport.authenticate('google-login', {scope:['https://www.googleapis.com/auth/plus.login', 'profile', 'email']}));

router.get('/google/redirect', passport.authenticate('google-login', {
	successRedirect:process.env.REDIRECT,
	failuerRedirect:'/auth/google/failed'
}));
router.get('/google/failed', controllers.googleLoginFailed);

router.get('/twitter', passport.authenticate('twitter-login'));

router.get('/twitter/redirect', passport.authenticate('twitter-login', {
	successRedirect:process.env.REDIRECT,
	failuerRedirect:'/auth/twitter/failed'
}));
router.get('/twitter/failed', controllers.twitterLoginFailed);

router.get('/logout', controllers.logout);

module.exports = router;