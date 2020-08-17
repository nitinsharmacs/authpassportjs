const mongodb = require('mongodb');
const _db = require('../util/database');

class User {
	constructor(user){
		this.userinfo = {
			username:user.username||'',
			email:user.email||'',
			password:user.password||'',
			facebook:user.facebook||{},
			google:user.google||{},
			twitter:user.twitter||{},
			name:user.name || '',
			createdAt: new Date
		}
		
	}
	
	save(){
		return _db.db.collection('users').insertOne(this.userinfo);
	}
	// a demo method that will be deleted when suggestions algorithm implemented
	static getUsers(userId){
		console.log(userId)
		return _db.db.collection('users').find({_id:{$ne:new mongodb.ObjectId(userId)}}).toArray();
	}
	// fetching users by id array
	static fetchUsersByIds(idsArray){
		return _db.db.collection('users').find({_id:{$in:idsArray}}).toArray();
	}

	//find by OR of username or email
	static findUser(username){
		return _db.db.collection('users').findOne({$or:[{username:username},{email:username}]});
	}
	//find user by Id
	static findUserById(userId){
		return _db.db.collection('users').findOne({_id:new mongodb.ObjectId(userId)});
	}
	// find user for registration
	static findUserReg(username, email){
		return _db.db.collection('users').findOne({$or:[{username:username}, {email:email}]});
	}
	// find user by facebook id
	static findUserFb(fbId){
		return _db.db.collection('users').findOne({"facebook.fbId":fbId});
	}
	// find user by googleId
	static findUserGoogle(googleId){
		return _db.db.collection('users').findOne({"google.googleId":googleId});
	}
	//find user by twitter id
	static findUserTwitter(twitterId){
		return _db.db.collection('users').findOne({"twitter.twitterId":twitterId});
	}
	static updateUser(_id, data={}){
		return _db.db.collection('users').updateOne({_id: new mongodb.ObjectId(_id)}, {$set:data}).then(res=>{
			if(!res)
				throw new Error('Not updated');
			return _db.db.collection('users').findOne({_id:new mongodb.ObjectId(_id)});
		});
	}
}

module.exports = User;

/*

facebook:{
	userId:'',
	token:''
}

*/