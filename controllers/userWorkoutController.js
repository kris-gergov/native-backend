const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const UserWorkout = require('../models/userWorkoutModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.aliasMine = (req, res, next) => {
	if (req.query.user) {
		const user = ObjectId(req.query.user);
		req.query = JSON.parse(`{ "user": { "$eq": "${user}" } }`);
	}
	req.query.limit = 5;
	req.query.sort = '-date';
	next();
};

exports.createUserWorkout = catchAsync(async (req, res) => {
	const newUserWorkout = await UserWorkout.create({
		user: req.body.user,
		workout: req.body.workout,
		date: req.body.date,
		time_taken: req.body.time_taken,
		exercises: req.body.exercises,
	});

	if (!newUserWorkout) {
		return res.status(404).send('User workout cannot be created');
	}

	res.status(201).json({
		status: 'success',
		data: {
			userWorkout: newUserWorkout,
		},
	});
});

exports.getAllUserWorkouts = factory.getAll(UserWorkout);
exports.getSingleUserWorkout = factory.getOne(UserWorkout);
exports.updateUserWorkout = factory.updateOne(UserWorkout);
exports.deleteUserWorkout = factory.deleteOne(UserWorkout);

exports.getStats = catchAsync(async (req, res, next) => {
	const workoutStats = await UserWorkout.aggregate([
		{
			$match: {
				user: { $eq: ObjectId(req.query.user) },
			},
		},
		{
			// ADD MOST WORKED BODY PART
			$group: {
				_id: null,
				totalWorkouts: { $sum: 1 },
				totalTime: { $sum: '$time_taken' },
				averageNumOfExercise: { $avg: { $size: '$exercises' } },
			},
		},
	]);

	const exerciseStats = await UserWorkout.aggregate([
		{
			$match: {
				user: { $eq: ObjectId(req.query.user) },
			},
		},
		{ $unwind: '$exercises' },
		{
			$project: {
				total: { $sum: '$exercises.executed_reps' },
				length: { $size: '$exercises.executed_reps' },
			},
		},
		{
			$group: {
				_id: null,
				totalExercises: { $sum: 1 },
				totalSets: { $sum: '$length' },
				totalReps: { $sum: '$total' },
			},
		},
	]);

	res.status(200).json({
		status: 'success',
		data: {
			workoutStatistics: workoutStats,
			exerciseStatistics: exerciseStats,
		},
	});
});

exports.getWeeklyStats = catchAsync(async (req, res, next) => {
	var today = new Date();
	var currentDate = new Date();
	var weekStart = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() == 0 ? -6 : 1)));

	const workoutStats = await UserWorkout.aggregate([
		{
			$match: {
				user: { $eq: ObjectId(req.query.user) },
				date: { $gte: weekStart, $lte: currentDate },
			},
		},
		{
			// ADD MOST WORKED BODY PART
			$group: {
				_id: null,
				totalWorkouts: { $sum: 1 },
				totalTime: { $sum: '$time_taken' },
				averageNumOfExercise: { $avg: { $size: '$exercises' } },
			},
		},
	]);

	res.status(200).json({
		status: 'success',
		data: {
			workoutStatistics: workoutStats,
		},
	});
});
