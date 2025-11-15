// const 
const express = require("express");
const app = express();
app.use(express.json());
const habitRoutes = require('./routers/habitRoutes');
const userRoutes = require('./routers/userRoutes');
const questRoutes = require('./routers/questRoutes');
const friendRoutes = require('./routers/friendRoutes');
const groupRoutes = require('./routers/groupRoutes');

const cors = require("cors");
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));
const mongoose = require('mongoose');
try {
    mongoose.connect("mongodb://localhost:27017/habify", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
} catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // stop server if DB connection fails
}


app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/groups', groupRoutes);


app.listen(3000,()=>{
    console.log("server running")
})