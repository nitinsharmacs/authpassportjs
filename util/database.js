"use-strict";

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

exports.db = null;

const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'feeberchat';

exports.dbConnection = (cb) => {
	MongoClient.connect(DB_URL, {useNewUrlParser:true}).then(client=>{
		exports.db = client.db(DB_NAME);
		return cb({error:false, db:client.db(DB_NAME)});
	}).catch(err=>{
		return cb({error:true, data:err});
	});
};


