// importing express
const express = require('express');

// importing 'cors' for 'strict-origin-when-cross-origin'
const cors = require('cors');

// importing .env
require('dotenv').config();
const PORT_LISTEN = process.env.PORT_LISTEN;
// const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS;

// initializing express app
const app = express();

// define cors options
// const corsOptions = {
// 	origin: function (origin, callback) {
// 		if (!origin || CORS_ALLOWED_ORIGINS.includes(origin)) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error('Not allowed by CORS'));
// 		}
// 	},
// 	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// 	// credentials: true,
// 	// optionsSuccessStatus: 204,
// 	// allowedHeaders: 'Content-Type,Authorization,username,password,token',
// };

// use cors middleware
app.use(cors());

// make sever accept payload in json format, using middleware
app.use(express.json());

const v1Routes = require('./routes/v1');

// Routes for different API versions
app.use('/api/v1', v1Routes); // example: http://example.com/api/v1/

const { connectToDB } = require('./db');
connectToDB();

// make express app to listen on PORT for incoming requests
app.listen(PORT_LISTEN, () => {
	console.log(`Server Started on  -->>  http://localhost:${PORT_LISTEN}`);
});
