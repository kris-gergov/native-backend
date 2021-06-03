const mongoose = require('mongoose');
const validator = require('validator');

const userWorkoutSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User is required'],
		index: true,
	},
	workout: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Workout',
		required: [true, 'Workout is required'],
		index: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	time_taken: {
		type: Number,
	},
	exercises: [
		{
			exercise: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Exercise',
				required: [true, 'Exercise is required'],
				index: true,
			},
			exercise_name: {
				type: String,
				required: [true, 'The exercise name is required'],
			},
			executed_reps: [
				{
					type: Number,
					required: [true, 'Reps is required'],
					min: [0, 'Reps cannot be below 0'],
				},
			],
		},
	],
});

userWorkoutSchema.pre(/^find/, function (next) {
	this.populate({ path: 'workout' });
	this.populate({ path: 'exercises.exercise' });
	next();
});

userWorkoutSchema.virtual('timeInMinutes').get(function () {
	return Math.floor(this.time_taken / 60);
});

userWorkoutSchema.set('toObject', { virtuals: true });
userWorkoutSchema.set('toJSON', { virtuals: true });

const UserWorkout = mongoose.model('UserWorkout', userWorkoutSchema);

module.exports = UserWorkout;
