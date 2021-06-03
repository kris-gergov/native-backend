const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
	const userList = await User.find();
	res.status(200).json({
		status: 'success',
		data: {
			userList,
		},
	});
});

exports.createUser = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		height: req.body.height,
		weight: req.body.weight,
		age: req.body.age,
		goal: req.body.goal,
	});

	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
		},
	});
});

exports.getSingleUser = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new AppError('No user found with that ID', 404));
	}
	res.status(200).json({
		status: 'success',
		data: {
			user: user,
		},
	});
});

exports.updateUser = catchAsync(async (req, res) => {
	console.log(req.params.id);
	console.log(req.body);
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!user) {
		return res.status(404).send('User cannot be found');
	}
	res.status(200).json({
		status: 'success',
		data: {
			user: user,
		},
	});
});

exports.deleteUser = catchAsync(async (req, res) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		return res.status(404).send('User cannot be found');
	}
	res.status(204).json({
		status: 'success',
		data: null,
	});
});
