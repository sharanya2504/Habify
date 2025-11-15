const express = require('express');
const { assignDailyQuests, getTodaysQuests, completeQuest } = require('../controllers/questController');
const router = express.Router();

router.post('/assign', assignDailyQuests);
router.get('/today/:userId', getTodaysQuests);
router.patch('/complete/:userQuestId', completeQuest); // Add this line

module.exports = router;