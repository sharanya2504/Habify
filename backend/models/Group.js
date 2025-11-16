const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    avatar: { type: String, default: '👥' },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now },
        role: { type: String, enum: ['admin', 'member'], default: 'member' }
    }],
    habits: [{
        name: { type: String, required: true },
        description: { type: String, default: '' },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
        completedBy: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            completedAt: { type: Date, default: Date.now }
        }]
    }],
    totalPoints: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, { collection: "groups" });

module.exports = mongoose.model('Group', groupSchema);