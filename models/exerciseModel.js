const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'The name is required'],
	},
	body_part: {
		type: String,
		required: [true, 'The body part is required'],
	},
	category: {
		type: String,
		required: [true, 'The category is required'],
	},
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
