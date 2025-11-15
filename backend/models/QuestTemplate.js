const mongoose = require('mongoose');

const questTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },         // task name
    description: { type: String, required: true },  // description/reward explanation
    type: { type: String, enum: ['daily','weekly','special'], required: true },
    goalStreak: { type: Number, required: true },   // number of consecutive days required
    diamonds: { type: Number, default: 0 }          // reward for completing goal streak
}, { collection: 'questTemplates' });

module.exports = mongoose.model('QuestTemplate', questTemplateSchema);
