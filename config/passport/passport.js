const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const credentials = require('../../secret/credentials');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../../modals/user');
const bcrypt = require('bcryptjs');


let methods = {
	local: User.findUserById,
	facebook:User.findUserFb,
	google:User.findUserGoogle,
	twitter:User.findUserTwitter
};

passport.serializeUser((user, done) => {
	console.log('SERSISALI');
	console.log(user);
  done(null, {id:user.id, type:user.type});
});


passport.deserializeUser((user, done) => {
	console.log('DESERIALIZE');
	console.log(user);
	methods[user.type](user.id).then(user=>{
		return done(null, user);
	}).catch(err=>done(err));
});


// passport setup for local login
passport.use('local-login', new LocalStrategy({
	usernameField:'username',
	passwordField:'password'
}, (username, password, done)=>{
	let userdata;
	User.findUser(username).then(user=>{
		console.log(user)
		if(!user)
			return done(null, false, {message:"User doesn't exist", status:404});
		userdata = user;
		return bcrypt.compare(password, user.password);
	}).then(passwordMatch=>{
		console.log(passwordMatch)
		if(!passwordMatch)
			return done(null, false, {message:"Invalid Password", status:401});
		return done(null, {...userdata, type:'local', id:userdata._id.toString()});
	}).catch(err=>done(err));
}));

// passport setup for local register
passport.use('local-register', new LocalStrategy({
	usernameField:'username',
	passwordField:'password',
	passReqToCallback:true
}, async (req, username, password, done)=>{
	console.log(req.body)

	try {
		let user = await User.findUser(username);
		if(user)
			return done(null, false, {message:"User exists, Please Login !", status:401});
		let passcode = await bcrypt.hash(password, 12);
		const newUser = new User({
				username:username,
				email:req.body.email,
				password:passcode
			});
		let result = await newUser.save();
		if(!result)
			return done(null, false, {message:"Registration Failed, Try again !", status: 500});
		return done(null, true, {message:"User Added", status:201});
	} catch (err) {
		return done(err);
	}
	

	// User.findUser(username).then(user=>{
	// 	console.log('user');
	// 	console.log(user)
	// 	if(!user)
	// 		return bcrypt.hash(password, 12);
			 
	// 	return done(null, false, {message:"User exists, Please Login !", status:401});
		
	// }).then(passcode=>{
	// 	if(!password)
	// 		return done(null, false, {message:"Internal Server Error", status:500});
	// 	const newUser = new User({
	// 		username:username,
	// 		email:req.body.email,
	// 		password:passcode
	// 	});
	// 	return newUser.save();
	// }).then(result=>{
	// 	if(!result)
	// 		return done(null, false, {message:"Registration Failed, Try again !", status: 500});
	// 	return done(null, true, {message:"User Added", status:201});
	// }).catch(err=>done(err));
}));

// passport facebook auth
passport.use('fb-login', new FacebookStrategy({
	...credentials.FB,
	callbackURL:'/auth/facebook/redirect',
	proxy:true
}, (accessToken, refreshToken, profile, done) => {
	User.findUserFb(profile.id).then(user=>{
		if(!user){
			let newUser = new User({
				facebook:{
					fbId:profile.id,
					token:accessToken
				},
				name:profile.displayName
			});
			return newUser.save();
		}
		return Promise.resolve(true);
	}).then(result=>{
		if(!result)
			return done(null, false, {message:"Facebook Login failed", status:500});
		
		return done(null, {name:profile.displayName, id:profile.id, type:'facebook'});
	}).catch(err=>done(err));
}));

// passport google auth
passport.use('google-login', new GoogleStrategy({
	...credentials.GOOGLE,
	callbackURL:'/auth/google/redirect'
}, (accessToken, refreshToken, profile, done)=>{
	console.log(profile)
	User.findUserGoogle(profile.id).then(user=>{
		if(!user){
			let newUser = new User({
				email:profile.emails[0].value,
				google:{
					googleId:profile.id,
					token:accessToken
				},
				name:profile.displayName
			});
			return newUser.save();
		}
		return Promise.resolve(true);
	}).then(result=>{
		if(!result)
			return done(null, false, {message:"Google Login failed", status:500});
		return done(null, {id:profile.id, name:profile.displayName, type:'google'});
	}).catch(err=>done(err));
}));

// passport twitter auth
passport.use('twitter-login', new TwitterStrategy({
	...credentials.TWITTER,
	callbackURL:'/auth/twitter/redirect',
	proxy:true
}, (token, tokenSecret, profile, done)=>{
	User.findUserTwitter(profile.id).then(user=>{
		if(!user){
			let newUser = new User({
				twitter:{
					twitterId:profile.id,
					token:token
				},
				name:profile.displayName
			});
			return newUser.save();
		}
		return Promise.resolve(true);
	}).then(result=>{
		if(!result)
			return done(null, false, {message:"Twitter Login failed", status:500});
		return done(null, {id:profile.id, name:profile.displayName, type:'twitter'});
	}).catch(err=>done(err));
}));

// NOTE : Not using twitter Authentication as twitter supports only OAuth 1 that requires session support 
