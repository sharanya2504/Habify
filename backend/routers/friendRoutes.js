const express = require('express');
const { 
    sendFriendRequest, 
    getFriendRequests, 
    acceptFriendRequest, 
    getFriends, 
    removeFriend 
} = require('../controllers/friendControllers');

const router = express.Router();

router.post('/send-request', sendFriendRequest);
router.get('/requests/:userId', getFriendRequests);
router.post('/accept-request', acceptFriendRequest);
router.get('/:userId', getFriends);
router.post('/remove', removeFriend);

module.exports = router;