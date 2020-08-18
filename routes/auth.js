const router = require('express').Router();
const passport = require('passport');

const controllers = require('../controllers/auth');

// router.post('/login', (req, res, next)=>{
// 	passport.authenticate('local-login', (err, user, info)=>{
// 		console.log(user);
// 		console.log(err);
// 		console.log(info)
// 		req.logIn(user, err=>{
// 			console.log('LOGIN')
// 			return res.status(200).json({message:'success', status:200})
// 		})
// 		// if(err)
// 		// 	return res.status(500).json({message:'Logined failed, try again', status:500});
// 		// if(!user){
// 		// 	return res.status(info.status).json({message:info.message, status:info.status});
// 		// 	req.logIn(user, err=>{
// 		// 		if(err)
// 		// 			return res.status(500).json({message:'login failed', status:500});
// 		// 		return res.status(200).json({message:'succ', status:200})
// 		// 	})
// 		// }
// 	})(req, res, next);
// });

// router.post('/login', passport.authenticate('local-login'), (req, res, next)=>{
// 		res.status(200).json({message:'donoe', status:200});
// 	// console.log(signature.sign(req.sessionID, process.env.JWT_KEY))
// 	//res.redirect(process.env.REDIRECT)
// })

//router.post('/login', passport.authenticate('local-login'),);


router.post('/login', (req, res, next)=>{
	passport.authenticate('local-login', (err, user, info)=>{
		req.user = user; req.err = err;req.info = info;
		return next();
	})(req, res, next);
}, controllers.localLogin);

// router.post('/login', passport.authenticate('local-login'), controllers.localLogin);

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