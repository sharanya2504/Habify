// src/data/achievements.ts

export const achievementsList = [
  // --------------------
  // LEVEL ACHIEVEMENTS
  // --------------------
  {
    id: "lvl-1",
    type: "level",
    levelRequired: 1,
    name: "Beginner Penguin",
    description: "Reached Level 1",
    icon: "🐣",
  },
  {
    id: "lvl-5",
    type: "level",
    levelRequired: 5,
    name: "Growing Strong",
    description: "Reached Level 5",
    icon: "🐧",
  },
  {
    id: "lvl-10",
    type: "level",
    levelRequired: 10,
    name: "Elite Penguin",
    description: "Reached Level 10",
    icon: "🦾",
  },
  {
    id: "lvl-20",
    type: "level",
    levelRequired: 20,
    name: "Master Penguin",
    description: "Reached Level 20",
    icon: "👑",
  },

  // --------------------
  // STREAK ACHIEVEMENTS
  // --------------------
  {
    id: "str-3",
    type: "streak",
    streakRequired: 3,
    name: "3-Day Streak",
    description: "Completed habits 3 days in a row",
    icon: "🔥",
  },
  {
    id: "str-7",
    type: "streak",
    streakRequired: 7,
    name: "7-Day Streak",
    description: "One whole week of consistency!",
    icon: "✨",
  },
  {
    id: "str-14",
    type: "streak",
    streakRequired: 14,
    name: "15-Day Streak",
    description: "Half a month streak!",
    icon: "🏅",
  },
  {
    id: "str-30",
    type: "streak",
    streakRequired: 30,
    name: "30-Day Streak",
    description: "You're unstoppable!",
    icon: "🌟",
  },
];
