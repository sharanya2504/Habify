const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    petName: { type: String, required: true },
    sleepHours: { type: String, required: true },
    wakeUpTime: { type: String, required: true },
    sleepTime: { type: String, required: true },
    
    createdAt: { type: Date, default: Date.now },

    totalDiamonds: { type: Number, default: 0 },
    totalDailyStreak: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 }
}, { collection: "users" });  // ✅ FIXED HERE

module.exports = mongoose.model('User', userSchema);
