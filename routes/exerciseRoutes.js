const express = require('express');
const exerciseController = require('../controllers/exerciseController');

const router = express.Router();

router.get('/', exerciseController.getAllExercises);
router.get('/:id', exerciseController.getSingleExercise);
router.post('/', exerciseController.createExercise);
router.patch('/:id', exerciseController.updateExercise);
router.delete('/:id', exerciseController.deleteExercise);

module.exports = router;
