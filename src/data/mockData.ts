// src/data/mockData.ts
// All mock datasets used across pages (tasks, friends, quests).
// Later these will be replaced by API responses.

import penguinBlue from "@/assets/penguin-blue.png";
import penguinPink from "@/assets/penguin-pink.png";
import penguinYellow from "@/assets/penguin-yellow.png";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  reward: number;
  streak: number;
};

export const mockTasks: Task[] = [
  { id: 1, title: "Morning meditation", completed: true, reward: 10, streak: 5 },
  { id: 2, title: "Drink 8 glasses of water", completed: false, reward: 10, streak: 3 },
  { id: 3, title: "30 min exercise", completed: false, reward: 15, streak: 0 },
  { id: 4, title: "Read for 20 minutes", completed: false, reward: 10, streak: 2 },
];

export type Friend = {
  id: number;
  name: string;
  penguinName: string;
  avatar: string;
  streak: number;
  gems: number;
};

export const mockFriends: Friend[] = [
  {
    id: 1,
    name: "Alex",
    penguinName: "Pippin",
    avatar: penguinBlue,
    streak: 12,
    gems: 342,
  },
  {
    id: 2,
    name: "Sam",
    penguinName: "Flurry",
    avatar: penguinPink,
    streak: 8,
    gems: 215,
  },
  {
    id: 3,
    name: "Jordan",
    penguinName: "Snowball",
    avatar: penguinYellow,
    streak: 15,
    gems: 428,
  },
];

export type Quest = {
  icon: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  difficulty: "Easy" | "Medium" | "Hard";
};

export const mockQuests: { daily: Quest[]; weekly: Quest[]; special: Quest[] } = {
  daily: [
    {
      icon: "💪",
      title: "Consistency Champion",
      description: "Complete all daily tasks for 3 days in a row",
      progress: 2,
      total: 3,
      reward: 2,
      difficulty: "Easy",
    },
    {
      icon: "🔥",
      title: "Streak Master",
      description: "Maintain a 7-day streak on any habit",
      progress: 5,
      total: 7,
      reward: 2,
      difficulty: "Medium",
    },
  ],
  weekly: [
    {
      icon: "🏆",
      title: "Weekly Warrior",
      description: "Complete 30 tasks this week",
      progress: 18,
      total: 30,
      reward: 2,
      difficulty: "Medium",
    },
    {
      icon: "🌟",
      title: "Perfect Week",
      description: "Achieve 100% task completion for 7 days",
      progress: 3,
      total: 7,
      reward: 3,
      difficulty: "Hard",
    },
  ],
  special: [
    {
      icon: "🎯",
      title: "Habit Builder",
      description: "Create and maintain 5 different habits",
      progress: 3,
      total: 5,
      reward: 3,
      difficulty: "Medium",
    },
    {
      icon: "👥",
      title: "Social Butterfly",
      description: "Invite 3 friends to join PenguinPal",
      progress: 1,
      total: 3,
      reward: 2,
      difficulty: "Easy",
    },
    {
      icon: "💎",
      title: "Gem Collector",
      description: "Earn a total of 50 gems",
      progress: 248,
      total: 1000,
      reward: 3,
      difficulty: "Hard",
    },
  ],
};

export const mockWeeklyProgress = [
  { day: "Mon", completed: 4, total: 5 },
  { day: "Tue", completed: 5, total: 5 },
  { day: "Wed", completed: 3, total: 5 },
  { day: "Thu", completed: 5, total: 5 },
  { day: "Fri", completed: 4, total: 5 },
  { day: "Sat", completed: 3, total: 4 },
  { day: "Sun", completed: 0, total: 4 },
];

export const mockWeeklyMoods = [
  { day: "Mon", mood: "😊" },
  { day: "Tue", mood: "😃" },
  { day: "Wed", mood: "😌" },
  { day: "Thu", mood: "🤗" },
  { day: "Fri", mood: "😊" },
  { day: "Sat", mood: "😴" },
  { day: "Sun", mood: "😌" },
];

export const mockGemHistory = [
  { action: "Completed Morning Meditation", gems: 1, time: "2 hours ago" },
  { action: "Quest: Consistency Champion", gems: 2, time: "Yesterday" },
  { action: "Completed all daily tasks", gems: 1, time: "2 days ago" },
  { action: "7-day streak bonus", gems: 3, time: "3 days ago" },
];

export const mockGroups = [
  {
    id: 1,
    name: "Morning Warriors",
    description: "Early risers committed to building morning routines",
    members: 12,
    totalPoints: 15420,
    avatar: "🌅",
    createdDate: "1 month ago",
  },
  {
    id: 2,
    name: "Fitness Fanatics",
    description: "Dedicated to daily exercise and health goals",
    members: 8,
    totalPoints: 9850,
    avatar: "💪",
    createdDate: "2 weeks ago",
  },
  {
    id: 3,
    name: "Study Squad",
    description: "Students supporting each other's learning goals",
    members: 15,
    totalPoints: 22100,
    avatar: "📚",
    createdDate: "3 weeks ago",
  },
];