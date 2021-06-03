require('dotenv/config');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Global Middleware
app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

const api = process.env.API_URL;

// Routers
const exerciseRouter = require('./routes/exerciseRoutes');
const userRouter = require('./routes/userRoutes');
const workoutRouter = require('./routes/workoutRoutes');
const userWorkoutRouter = require('./routes/userWorkoutRoutes');

app.use(`${api}/exercises`, exerciseRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/workouts`, workoutRouter);
app.use(`${api}/userWorkouts`, userWorkoutRouter);

// 404 route handler
app.all('*', (req, res, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

// Database
mongoose
	.connect(process.env.CONNECTION_STRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('Database connected');
	})
	.catch(err => {
		console.log(err);
	});

// Server
app.listen(3000, () => {
	console.log('Running on port 3000');
});
