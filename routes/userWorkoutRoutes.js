const express = require('express');
const userWorkoutController = require('../controllers/userWorkoutController');

const router = express.Router();
router.get('/weeklyStats', userWorkoutController.getWeeklyStats);
router.get('/stats', userWorkoutController.getStats);
router.get('/mine', userWorkoutController.aliasMine, userWorkoutController.getAllUserWorkouts);
router.get('/', userWorkoutController.getAllUserWorkouts);
router.get('/:id', userWorkoutController.getSingleUserWorkout);
router.post('/', userWorkoutController.createUserWorkout);
router.patch('/:id', userWorkoutController.updateUserWorkout);
router.delete('/:id', userWorkoutController.deleteUserWorkout);

module.exports = router;
