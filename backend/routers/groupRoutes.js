const express = require('express');
const { 
    createGroup, 
    getUserGroups, 
    addMemberToGroup, 
    createGroupHabit 
} = require('../controllers/groupControllers');

const router = express.Router();

router.post('/create', createGroup);
router.get('/user/:userId', getUserGroups);
router.post('/add-member', addMemberToGroup);
router.post('/create-habit', createGroupHabit);

module.exports = router;