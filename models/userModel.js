const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'The name is required'],
	},
	email: {
		type: String,
		required: [true, 'The email field is required'],
		unqiue: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			// Only works on save() OR create() - not on update()
			validator: function (el) {
				return el === this.password; // Checks for matching passwords
			},
			message: 'Passwords must match',
		},
		select: false,
	},
	height: {
		type: Number,
		required: [true, 'Height is required'],
		min: [0, 'Height cannot be below 0'],
	},
	weight: {
		type: Number,
		required: [true, 'Weight is required'],
		min: [0, 'Weight cannot be below 0'],
	},
	age: {
		type: Number,
		required: [true, 'Age is required'],
		min: [0, 'Age cannot be below 0'],
	},
	goal: {
		type: String,
		required: [true, 'Goal is required'],
		default: 'general',
		enum: ['general', 'weight_loss', 'muscle_gain'],
	},
	isAdmin: {
		type: Boolean,
		required: [true],
		default: false,
	},
});

userSchema.pre('save', async function (next) {
	// Return if the password has not been modified
	if (!this.isModified('password')) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
