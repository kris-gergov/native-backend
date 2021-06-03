const express = require('express');
const workoutController = require('../controllers/workoutController');

const router = express.Router();

router.get('/', workoutController.getAllWorkouts);
router.get('/:id', workoutController.getSingleWorkout);
router.post('/', workoutController.createWorkout);
router.patch('/:id', workoutController.updateWorkout);
router.delete('/:id', workoutController.deleteWorkout);

module.exports = router;
