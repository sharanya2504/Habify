import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Habit, Achievement, Journey } from '@/types/habit';

interface AppContextType {
  profile: UserProfile | null;
  habits: Habit[];
  achievements: Achievement[];
  journeys: Journey[];
  setProfile: (profile: UserProfile) => void;
  addHabit: (habit: Habit) => void;
  toggleHabitComplete: (habitId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('rehabit_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('rehabit_habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements] = useState<Achievement[]>([
    { id: '1', name: 'Rising Blossom', description: 'Complete your first habit', icon: '🌸', requirement: 1, progress: 0 },
    { id: '2', name: 'Consistency Penguin', description: 'Maintain a 7-day streak', icon: '🐧', requirement: 7, progress: 0 },
    { id: '3', name: 'Focus Star', description: 'Complete 20 habits', icon: '⭐', requirement: 20, progress: 0 },
    { id: '4', name: 'Self-Care Hero', description: 'Complete 50 habits', icon: '💜', requirement: 50, progress: 0 },
  ]);

  const [journeys] = useState<Journey[]>([
    { id: '1', name: 'Mindful Morning Quest', description: 'Start your days with intention', icon: '🌅', isUnlocked: true, habits: [], progress: 0, totalSteps: 5 },
    { id: '2', name: 'Healthy Hydration Journey', description: 'Build better water habits', icon: '💧', isUnlocked: false, habits: [], progress: 0, totalSteps: 10 },
  ]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('rehabit_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('rehabit_habits', JSON.stringify(habits));
  }, [habits]);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
  };

  const addHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
  };

  const toggleHabitComplete = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);
        const newCompletedDates = isCompleted
          ? habit.completedDates.filter(d => d !== today)
          : [...habit.completedDates, today];
        
        const newStreak = isCompleted ? Math.max(0, habit.currentStreak - 1) : habit.currentStreak + 1;
        
        if (!isCompleted && profile) {
          setProfileState({
            ...profile,
            xp: profile.xp + 10,
            level: Math.floor((profile.xp + 10) / 100) + 1,
          });
        }

        return {
          ...habit,
          completedDates: newCompletedDates,
          currentStreak: newStreak,
          longestStreak: Math.max(habit.longestStreak, newStreak),
        };
      }
      return habit;
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfileState({ ...profile, ...updates });
    }
  };

  return (
    <AppContext.Provider value={{ profile, habits, achievements, journeys, setProfile, addHabit, toggleHabitComplete, updateProfile }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
