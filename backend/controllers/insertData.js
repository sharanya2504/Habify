const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
const QuestTemplate = require('../models/QuestTemplate');

// dotenv.config();
// connectDB();
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
const dailyQuests = [
  {"name":"Drink Water","description":"Drink water 3 times today to earn diamonds","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Morning Stretch","description":"Stretch for 10 mins","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Read 10 Pages","description":"Read 10 pages of a book","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Meditate","description":"Meditate for 10 mins","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Take a Walk","description":"Walk at least 1000 steps","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Healthy Breakfast","description":"Eat a healthy breakfast","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"No Junk Food","description":"Avoid junk food today","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Plan Day","description":"Plan your day in morning","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Gratitude Journal","description":"Write 3 things you are grateful for","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Hydration Check","description":"Drink at least 2L of water","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Learn Something New","description":"Spend 15 mins learning a skill","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"No Social Media","description":"Avoid social media for 1 hour","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Clean Desk","description":"Keep your workspace tidy","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Stretch Breaks","description":"Take 3 stretch breaks today","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Read News","description":"Read at least 1 news article","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Drink Green Tea","description":"Have 1 cup of green tea","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Walk Outside","description":"Take a 10-min walk","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"No Sugar Snacks","description":"Avoid sugary snacks today","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Evening Reflection","description":"Reflect on your day for 5 mins","type":"daily","goalStreak":3,"diamonds":5},
  {"name":"Early Sleep","description":"Sleep at least 7 hours tonight","type":"daily","goalStreak":3,"diamonds":5}
];

const weeklyQuests = [
  {"name":"Read a Book","description":"Read 50 pages in a week","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Exercise 3 Times","description":"Workout 3 times this week","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Meditate 3 Times","description":"Meditate 3 times in a week","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"No Junk Food","description":"Avoid junk food for 3 days","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Walk 10k Steps","description":"Walk 10,000 steps in a week","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Learn Skill","description":"Spend 1 hour learning a skill","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Clean Room","description":"Clean your room this week","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Plan Week","description":"Plan your week ahead","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Read News","description":"Read 3 news articles","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Cook Healthy Meal","description":"Cook a healthy meal this week","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Drink Water 10L","description":"Drink 10 liters of water this week","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"No Sugar Days","description":"Avoid sugar for 3 days","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Gratitude Journal","description":"Write gratitude journal 3 times","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Stretch 3 Times","description":"Stretch 3 times during the week","type":"weekly","goalStreak":2,"diamonds":10},
  {"name":"Digital Detox","description":"Stay offline 1 hour","type":"weekly","goalStreak":2,"diamonds":10}
];

const specialQuests = [
  {"name":"Meditation Challenge","description":"Meditate 10 mins for 2 days straight to earn 15 diamonds","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Hydration Challenge","description":"Drink 3L water for 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Read Challenge","description":"Read 20 pages for 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Exercise Challenge","description":"Workout 30 mins for 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Early Wakeup","description":"Wake up before 7AM for 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"No Sugar","description":"Avoid sugar for 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Digital Detox","description":"Stay offline for 2 hours for 2 days","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Healthy Meal","description":"Cook healthy meal 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Gratitude Journal","description":"Write gratitude journal 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Walk Challenge","description":"Walk 5000 steps for 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Clean Desk","description":"Keep desk tidy for 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Stretch Challenge","description":"Stretch 10 mins for 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Water Reminder","description":"Drink 8 cups water for 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Reading Challenge","description":"Read an article for 2 days straight","type":"special","goalStreak":2,"diamonds":15},
  {"name":"Sleep Early","description":"Sleep before 11PM for 2 days straight","type":"special","goalStreak":2,"diamonds":15}
];

const insertQuests = async () => {
    try {
        await QuestTemplate.insertMany([...dailyQuests, ...weeklyQuests, ...specialQuests]);
        console.log('Mock quests inserted successfully!');
        process.exit();
    } catch (err) {
        console.error('Error inserting mock quests:', err.message);
        process.exit(1);
    }
};

insertQuests();
