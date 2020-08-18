const jwt = require('jsonwebtoken');
const signature = require('cookie-signature');

exports.localLogin = (req, res) => {

	if(!req.user)
		return res.status(req.info.status || 500).json(req.info);
	let token = jwt.sign({
		id:req.user.id,
		usernmae:req.user.username,
		type:'local'
	}, process.env.JWT_KEY, {
		expiresIn:'5h'
	});
	return res.status(200).json({message:"Login Successful", token:token, status:200});
};
exports.localRegister = (req, res) => {
	if(!req.user)
		return res.status(req.info.status || 500).json(req.info);
	return res.status(201).json({message:"User Registered", status:201});
};
exports.fbLoginFailed = (req, res) => {
	return res.status(401).json({message:'Facebook Login Failed', status:401});
};
exports.googleLoginFailed = (req, res) => {
	return res.status(401).json({message:'Google Login Failed', status:401});
};
exports.twitterLoginFailed = (req, res) => {
	return res.status(401).json({message:'Twitter Login Failed', status:401});
};

exports.logout = (req, res) => {
	req.logout();
	res.redirect(process.env.REDIRECT);
};