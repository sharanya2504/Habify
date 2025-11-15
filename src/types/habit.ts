export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: 'lavender' | 'mint' | 'peach' | 'sky';
  frequency: HabitFrequency;
  time?: string;
  notificationEnabled: boolean;
  isGroupHabit: boolean;
  createdAt: string;
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
}

export interface UserProfile {
  id: string;
  username: string;
  petName: string;  
  mascot: 'penguin';
  totalGems: number; 
  currentStreak: number;  
  level: number;
  xp: number;
  wakeTime: string;
  sleepTime: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: number;
  progress: number;
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

export interface Achievement {
  id: string;

  type: "level" | "streak";

  // Display Info
  name: string;
  description: string;
  icon: string;

  levelRequired?: number;   
  streakRequired?: number;  

  unlocked: boolean;        
  unlockedAt?: string;  
}
