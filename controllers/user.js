const User = require('../modals/user');
const jwt = require('jsonwebtoken');

let methods = {
	local: User.findUserById,
	facebook:User.findUserFb,
	google:User.findUserGoogle,
	twitter:User.findUserTwitter
}

exports.getUser = (req, res) => {

	let authHeader = req.get('Authorization');
	if(!authHeader)
		return res.status(400).json({message:'Bad Request', status:400});
	let token = authHeader.split(' ')[1];
	let decodedToken = jwt.verify(token, process.env.JWT_KEY);
	console.log(decodedToken)
	methods[decodedToken.type](decodedToken.id).then(user=>{
		console.log(user)
		return res.status(200).json({message:'User found', data:{name:user.name, id:user._id, username:user.username}, status:200});
	}).catch(err=>{
		console.log(err);
		return res.status(err.status || 500).json({message:err.message || "Internal Server Error", status:err.status || 500});
	})
};