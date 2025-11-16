export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  // ID Fields
  _id?: string;           // MongoDB ID
  id?: string;            // Alternative ID field
  
  // Core Habit Data
  userId: string;
  title: string;          // Use 'title' instead of 'name'
  emoji: string;
  color: 'lavender' | 'mint' | 'peach' | 'sky' | string;
  reminders: string[];
  frequency: HabitFrequency;
  
  // Completion Tracking
  completed: boolean;     // Use boolean instead of completedDates array
  taskStreak: number;     // Use 'taskStreak' instead of 'currentStreak'
  lastCompleted: string | null;
  
  // Legacy fields for backward compatibility (optional)
  completedDates?: string[];
  currentStreak?: number;
  longestStreak?: number;
  
  // Additional fields
  createdAt: string;
  notificationEnabled?: boolean;
  isGroupHabit?: boolean;
  time?: string;
}

export interface UserProfile {
  // ID Fields
  id: string;
  _id?: string;           // MongoDB ID
  
  // User Information
  username: string;
  phone?: string;
  petName: string;
  mascot: 'penguin';
  
  // Stats & Progress
  level: number;
  xp: number;
  totalGems: number;
  totalDiamonds?: number;  // Alternative name for gems
  currentStreak: number;
  totalDailyStreak?: number;
  
  // Schedule & Preferences
  wakeTime: string;
  sleepTime: string;
  sleepHours?: string;
  
  // Timestamps
  createdAt: string;
}

export interface Achievement {
  id: string;
  
  // Type & Requirements
  type: "level" | "streak" | "habit_count";
  
  // Display Info
  name: string;
  description: string;
  icon: string;
  
  // Requirements (only one should be used based on type)
  levelRequired?: number;
  streakRequired?: number;
  habitCountRequired?: number;
  requirement?: number; // Legacy field
  
  // Progress & Unlock Status
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number; // Legacy field
}

export interface Journey {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  habits: string[];
  progress: number;
  totalSteps: number;
}

// Additional types for your quest system
export interface QuestTemplate {
  _id: string;
  name: string;
  description: string;
  type: "daily" | "weekly" | "special";
  goalStreak: number;
  diamonds: number;
}

export interface UserQuest {
  _id: string;
  userId: string;
  questId: QuestTemplate;
  type: "daily" | "weekly" | "special";
  assignedDate: string;
  completed: boolean;
  currentStreak: number;
  goalStreak: number;
  diamonds: number;
  rewarded: boolean;
}