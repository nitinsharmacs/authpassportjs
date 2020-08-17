const jwt = require('jsonwebtoken');

exports.localLogin = (req, res) => {
	if(!req.user)
		return res.status(req.info.status || 500).json(req.info);
	let token = jwt.sign({
		type:'local',
		username:req.user.username,
		id:req.user._id
	}, process.env.JWT_KEY, {
		expiresIn:'5h'
	});
	return res.status(200).json({message:"Login Successful", status:200, token:token});
};
exports.localRegister = (req, res) => {
	if(!req.user)
		return res.status(req.info.status || 500).json(req.info);
	return res.status(201).json({message:"User Registered", status:201});
};
exports.fbLogin = (req, res) => {
	console.log(req.user)
	if(req.err){
		console.log(req.err);
	}
	if(!req.user)
		return res.status(req.info.status || 500).json(req.info);
	let token = jwt.sign({
		type:'facebook',
		id:req.user.id
	}, process.env.JWT_KEY , {
		expiresIn:'5h'
	});
	res.cookie('token',token, {maxAge:5*3600*1000,});
	return res.redirect(process.env.REDIRECT);
};
exports.googleLogin = (req, res) => {
	if(!req.user)
		return status(req.info.status || 500).json(req.info);
	let token = jwt.sign({
		type:'google',
		id:req.user.id
	}, process.env.JWT_KEY, {
		expiresIn:'5h'
	});
	console.log(req)
	return res.status(200).cookie('token', token, { domain:'https://competent-saha-d69324.netlify.app', maxAge:5*3600*1000}).redirect(process.env.REDIRECT);
	
};
exports.twitterLogin = (req, res) => {
	if(!req.user)
		return res.status(req.info.status || 500).json(req.info);
	let token = jwt.sign({
		type:'twitter',
		id:req.user.id
	}, process.env.JWT_KEY, {
		expiresIn:'5h'
	});
	res.cookie('token',token, {maxAge:5*3600*1000});
	return res.redirect(process.env.REDIRECT);
};
