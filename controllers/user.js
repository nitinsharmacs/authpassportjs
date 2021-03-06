const User = require('../modals/user');
const jwt = require('jsonwebtoken');


exports.getUser = async (req, res) => {

	let token = req.get('Authorization').split(' ')[1];
	//console.log(typeof token)

	if(req.user){
		return res.status(200).json({message:'User found', data:{name:req.user.name,username:req.user.username}, status:200});
	} 

	if(token!=='undefined') {

		try{
			let decodedToken = jwt.verify(token, process.env.JWT_KEY);
			let user = await User.findUserById(decodedToken.id);
			return res.status(200).json({message:'User found', data:{name:user.name,username:user.username}, status:200});
		} catch (err) {
			console.log(err);
			return res.status(500).json({message:'Something went wrong', status:500});
		}
	}
		
	
	return res.status(401).json({message:'UnAuthorized Access', status:401});
	

	
};