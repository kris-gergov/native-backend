const mongoose = require('mongoose');
const validator = require('validator');

const workoutSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'The name is required'],
	},
	description: {
		type: String,
		required: [true, 'The description is required'],
	},
	level: {
		type: String,
		required: [true, 'Level is required'],
		default: 'beginner',
		enum: ['beginner', 'intermediate', 'advanced'],
	},
	exercises: [
		{
			exercise: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Exercise',
				required: [true, 'Exercise is required'],
				index: true,
			},
			default_reps: [
				{
					type: Number,
					required: [true, 'Reps is required'],
					min: [0, 'Reps cannot be below 0'],
				},
			],
		},
	],
});

workoutSchema.pre(/^find/, function (next) {
	this.populate({ path: 'exercises.exercise' });
	next();
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
