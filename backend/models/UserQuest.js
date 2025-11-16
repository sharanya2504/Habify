const mongoose = require('mongoose');

const userQuestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestTemplate', required: true },
    type: { type: String, enum: ['daily','weekly','special'], required: true },
    assignedDate: { type: Date, required: true },       // the date this quest is assigned
    completed: { type: Boolean, default: false },       // completed for the day
    currentStreak: { type: Number, default: 0 },        // consecutive days completed
    goalStreak: { type: Number, required: true },       // copied from template
    diamonds: { type: Number, required: true }   ,
    rewarded: { type: Boolean, default: false }        // copied from template
}, { collection: 'userQuests' });

module.exports = mongoose.model('UserQuest', userQuestSchema);
