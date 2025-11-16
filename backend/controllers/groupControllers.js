const Group = require('../models/Group');
const User = require('../models/User');

// Create group
exports.createGroup = async (req, res) => {
    try {
        const { userId, name, description, avatar } = req.body;

        const group = new Group({
            name,
            description,
            avatar: avatar || '👥',
            createdBy: userId,
            members: [{
                user: userId,
                role: 'admin'
            }]
        });

        await group.save();

        // Add group to user's groups
        await User.findByIdAndUpdate(userId, {
            $push: { groups: group._id }
        });

        res.json({
            success: true,
            message: 'Group created successfully',
            group
        });

    } catch (err) {
        console.error('Error creating group:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get user's groups
exports.getUserGroups = async (req, res) => {
    try {
        const { userId } = req.params;

        const groups = await Group.find({ 'members.user': userId })
            .populate('members.user', 'name petName totalDiamonds')
            .populate('createdBy', 'name');

        res.json({
            success: true,
            groups
        });

    } catch (err) {
        console.error('Error getting user groups:', err);
        res.status(500).json({ error: err.message });
    }
};

// Add member to group
exports.addMemberToGroup = async (req, res) => {
    try {
        const { groupId, userPhone } = req.body;

        // Find user by phone
        const user = await User.findOne({ phone: userPhone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if already member
        const isMember = group.members.some(member => 
            member.user.toString() === user._id.toString()
        );
        if (isMember) {
            return res.status(400).json({ error: 'User already in group' });
        }

        // Add to group
        group.members.push({
            user: user._id,
            role: 'member'
        });

        // Add group to user's groups
        await User.findByIdAndUpdate(user._id, {
            $push: { groups: groupId }
        });

        await group.save();

        res.json({
            success: true,
            message: 'Member added to group',
            group
        });

    } catch (err) {
        console.error('Error adding member to group:', err);
        res.status(500).json({ error: err.message });
    }
};

// Create group habit
exports.createGroupHabit = async (req, res) => {
    try {
        const { groupId, name, description, userId } = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        group.habits.push({
            name,
            description,
            createdBy: userId
        });

        await group.save();

        res.json({
            success: true,
            message: 'Group habit created',
            group
        });

    } catch (err) {
        console.error('Error creating group habit:', err);
        res.status(500).json({ error: err.message });
    }
};