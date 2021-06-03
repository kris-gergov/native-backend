const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const Workout = require('../models/workoutModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createWorkout = catchAsync(async (req, res) => {
	const newWorkout = await Workout.create({
		name: req.body.name,
		description: req.body.description,
		level: req.body.level,
		exercises: req.body.exercises,
	});

	if (!newWorkout) {
		return res.status(404).send('Workout cannot be created');
	}

	res.status(201).json({
		status: 'success',
		data: {
			workout: newWorkout,
		},
	});
});

exports.getAllWorkouts = factory.getAll(Workout);
exports.getSingleWorkout = factory.getOne(Workout);
exports.updateWorkout = factory.updateOne(Workout);
exports.deleteWorkout = factory.deleteOne(Workout);
