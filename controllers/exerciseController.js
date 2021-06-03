const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const Exercise = require('../models/exerciseModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createExercise = catchAsync(async (req, res) => {
	const newExercise = await Exercise.create({
		name: req.body.name,
		body_part: req.body.body_part,
		category: req.body.category,
	});

	if (!newExercise) {
		return res.status(404).send('Exercise cannot be created');
	}

	res.status(201).json({
		status: 'success',
		data: {
			exercise: newExercise,
		},
	});
});

exports.getAllExercises = factory.getAll(Exercise);
exports.getSingleExercise = factory.getOne(Exercise);
exports.updateExercise = factory.updateOne(Exercise);
exports.deleteExercise = factory.deleteOne(Exercise);
