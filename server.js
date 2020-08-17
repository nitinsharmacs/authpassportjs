const server = require('express')();
require('dotenv').config();
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

const passportConfig = require('./config/passport/passport');

const dbConnection = require('./util/database').dbConnection;

//routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

//CORS
server.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PETCH, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type, Authorization');
	res.setHeader('Access-Control-Expose-Headers','Authorization');
	if(req.method == 'OPTIONS'){
		return res.sendStatus(200);
	}
	next();
});

server.use(bodyParser.json());

server.use(cookieSession({
	name:'test',
	keys:[process.env.JWT_KEY],
	maxAge:5*3600*1000
})
);
server.use(cookieParser());

server.use(passport.initialize());

server.use('/auth', authRoutes);
server.use('/user', userRoutes);

server.use('/', (req, res)=>{
	res.send('Server is runnig')
})
const port = process.env.PORT || 3001;

dbConnection((db)=>{
	server.listen(port, ()=>{
		console.log('Server is running on '+port)
	});
});

