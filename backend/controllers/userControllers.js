const User = require('../models/User');

// create or register user
exports.createUser = async (req, res) => {
    const { name, phone, petName, sleepHours, wakeUpTime, sleepTime } = req.body;

    try {
        // check if user already exists with same phone
        let user = await User.findOne({ phone });

        if (user) {
            // return existing user
            return res.status(200).json({
                message: "User already exists. Loaded existing data.",
                user
            });
        }

        // create new user
        user = await User.create({ name, phone, petName, sleepHours, wakeUpTime, sleepTime });

        res.status(201).json({
            message: "New user created.",
            user
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
