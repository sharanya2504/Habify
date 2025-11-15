const express = require('express');
const { addHabit, getUserHabits, completeHabit } = require('../controllers/habitControllers');
const router = express.Router();

router.post('/add', addHabit);                     // add a habit
router.get('/:userId', getUserHabits);            // get all habits of a user
router.patch('/complete/:habitId', completeHabit);// mark habit as completed

module.exports = router;
