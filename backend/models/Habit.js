const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    emoji: { type: String, default: '' },
    color: { type: String, default: '#FFFFFF' },
    reminders: [{ type: String }],
    frequency: { type: String, enum: ['daily','weekly','monthly'], default: 'daily' },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    taskStreak: { type: Number, default: 0 },
    lastCompleted: Date
}, { collection: 'habits' });

module.exports = mongoose.model('Habit', habitSchema);
