const credentials = {
	FB:{
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET
	},
	GOOGLE:{
		clientID: process.env.GOOGLE_CONSUMER_KEY,
		clientSecret: process.env.GOOGLE_CONSUMER_SECRET
	},
	TWITTER:{
		consumerKey: process.env.TWITTER_CONSUMER_KEY,
		consumerSecret: process.env.TWITTER_CONSUMER_SECRET
	}
};

module.exports = credentials;