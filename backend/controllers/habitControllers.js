const Habit = require('../models/Habit');
const User = require('../models/User');

/**
 * Add a Habit
 */
exports.addHabit = async (req, res) => {
    const { userId, title, emoji, color, reminders, frequency } = req.body;

    if (!userId || !title)
        return res.status(400).json({ message: "userId and title are required" });

    try {
        const habit = await Habit.create({
            userId,
            title,
            emoji: emoji || "",
            color: color || "#FFFFFF",
            reminders: reminders || [],
            frequency: frequency || "daily",
            completed: false,
            taskStreak: 0,
            lastCompleted: null
        });

        return res.status(201).json(habit);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * Get all habits of a user
 */
exports.getUserHabits = async (req, res) => {
    const { userId } = req.params;

    try {
        const habits = await Habit.find({ userId });
        return res.json(habits);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/**
 * Mark habit completed + update streak + give diamonds
 */
exports.completeHabit = async (req, res) => {
    const { habitId } = req.params;

    try {
        const habit = await Habit.findById(habitId);
        if (!habit) return res.status(404).json({ message: "Habit not found" });

        const today = new Date().toISOString().slice(0, 10);
        const lastDate = habit.lastCompleted
            ? habit.lastCompleted.toISOString().slice(0, 10)
            : null;

        if (lastDate === today) {
            return res.json({ message: "Already completed today", habit });
        }

        if (!lastDate) {
            habit.taskStreak = 1;
        } else {
            const difference =
                (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24);

            habit.taskStreak = difference === 1 ? habit.taskStreak + 1 : 1;
        }

        habit.lastCompleted = new Date();
        habit.completed = true;
        await habit.save();

        // -----------------------------
        // DIAMOND UPDATE SECTION
        // -----------------------------
        const user = await User.findById(habit.userId);

        if (!user) {
            console.log("User not found for habit:", habit._id);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Diamonds BEFORE:", user.totalDiamonds);

        user.totalDiamonds = (user.totalDiamonds || 0) + 10;

        await user.save();

        console.log("Diamonds AFTER:", user.totalDiamonds);

        return res.json({
            habit,
            totalDiamonds: user.totalDiamonds
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};
