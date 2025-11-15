const User = require('../models/User');

// Send friend request
exports.sendFriendRequest = async (req, res) => {
    try {
        const { userId, friendPhone } = req.body;
        
        // Find friend by phone
        const friend = await User.findOne({ phone: friendPhone });
        if (!friend) {
            return res.status(404).json({ error: 'User not found with this phone number' });
        }

        if (friend._id.toString() === userId) {
            return res.status(400).json({ error: 'Cannot add yourself as friend' });
        }

        // Check if already friends
        const user = await User.findById(userId);
        if (user.friends.includes(friend._id)) {
            return res.status(400).json({ error: 'Already friends with this user' });
        }

        // Check if request already sent
        const existingRequest = friend.friendRequests.find(
            req => req.from.toString() === userId && req.status === 'pending'
        );
        if (existingRequest) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        // Add friend request
        friend.friendRequests.push({
            from: userId,
            status: 'pending'
        });

        await friend.save();

        res.json({
            success: true,
            message: 'Friend request sent successfully',
            friend: {
                _id: friend._id,
                name: friend.name,
                phone: friend.phone,
                petName: friend.petName,
                totalDiamonds: friend.totalDiamonds,
                totalDailyStreak: friend.totalDailyStreak
            }
        });

    } catch (err) {
        console.error('Error sending friend request:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get friend requests
exports.getFriendRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId)
            .populate('friendRequests.from', 'name phone petName totalDiamonds totalDailyStreak');

        const pendingRequests = user.friendRequests.filter(req => req.status === 'pending');

        res.json({
            success: true,
            requests: pendingRequests
        });

    } catch (err) {
        console.error('Error getting friend requests:', err);
        res.status(500).json({ error: err.message });
    }
};

// Accept friend request
exports.acceptFriendRequest = async (req, res) => {
    try {
        const { userId, requestId } = req.body;

        const user = await User.findById(userId);
        const request = user.friendRequests.id(requestId);

        if (!request) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        // Update request status
        request.status = 'accepted';

        // Add to friends list for both users
        user.friends.push(request.from);
        await User.findByIdAndUpdate(request.from, { 
            $push: { friends: userId } 
        });

        await user.save();

        // Get updated friend info
        const friend = await User.findById(request.from)
            .select('name phone petName totalDiamonds totalDailyStreak');

        res.json({
            success: true,
            message: 'Friend request accepted',
            friend
        });

    } catch (err) {
        console.error('Error accepting friend request:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get user's friends
exports.getFriends = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .populate('friends', 'name phone petName totalDiamonds totalDailyStreak createdAt');

        res.json({
            success: true,
            friends: user.friends
        });

    } catch (err) {
        console.error('Error getting friends:', err);
        res.status(500).json({ error: err.message });
    }
};

// Remove friend
exports.removeFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        // Remove from both users' friend lists
        await User.findByIdAndUpdate(userId, {
            $pull: { friends: friendId }
        });

        await User.findByIdAndUpdate(friendId, {
            $pull: { friends: userId }
        });

        res.json({
            success: true,
            message: 'Friend removed successfully'
        });

    } catch (err) {
        console.error('Error removing friend:', err);
        res.status(500).json({ error: err.message });
    }
};