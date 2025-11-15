import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { UserProfile, Habit, Achievement, Journey } from "@/types/habit";
import { achievementsList } from "@/data/achievements"; // ⭐ NEW FILE YOU CREATED

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
  // -------------------------------
  // PROFILE STATE
  // -------------------------------
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("rehabit_profile");
    return saved ? JSON.parse(saved) : null;
  });

  // -------------------------------
  // HABITS STATE
  // -------------------------------
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("rehabit_habits");
    return saved ? JSON.parse(saved) : [];
  });

  // -------------------------------
  // ACHIEVEMENTS (DYNAMIC + SAVED)
  // -------------------------------
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("rehabit_achievements");
    return saved ? JSON.parse(saved) : [];
  });

  // -------------------------------
  // JOURNEYS (STATIC)
  // -------------------------------
  const [journeys] = useState<Journey[]>([
    {
      id: "1",
      name: "Mindful Morning Quest",
      description: "Start your days with intention",
      icon: "🌅",
      isUnlocked: true,
      habits: [],
      progress: 0,
      totalSteps: 5,
    },
    {
      id: "2",
      name: "Healthy Hydration Journey",
      description: "Build better water habits",
      icon: "💧",
      isUnlocked: false,
      habits: [],
      progress: 0,
      totalSteps: 10,
    },
  ]);

  // -------------------------------
  // SAVE PROFILE TO LOCAL STORAGE
  // -------------------------------
  useEffect(() => {
    if (profile) {
      localStorage.setItem("rehabit_profile", JSON.stringify(profile));
    }
  }, [profile]);

  // -------------------------------
  // SAVE HABITS TO LOCAL STORAGE
  // -------------------------------
  useEffect(() => {
    localStorage.setItem("rehabit_habits", JSON.stringify(habits));
  }, [habits]);

  // -------------------------------
  // SAVE ACHIEVEMENTS TO STORAGE
  // -------------------------------
  useEffect(() => {
    localStorage.setItem("rehabit_achievements", JSON.stringify(achievements));
  }, [achievements]);

  // -------------------------------
  // SET PROFILE
  // -------------------------------
  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
  };

  // -------------------------------
  // ADD HABIT
  // -------------------------------
  const addHabit = (habit: Habit) => {
    setHabits((prev) => [...prev, habit]);
  };

  // -------------------------------
  // CALCULATE GLOBAL STREAK
  // -------------------------------
  function computeStreak(): number {
    if (!habits.length) return 0;

    let streak = 0;
    let cursor = new Date();

    while (true) {
      const iso = cursor.toISOString().split("T")[0];

      const completedToday = habits.some((h) =>
        h.completedDates.includes(iso)
      );

      if (completedToday) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // -------------------------------
  // UNLOCK ACHIEVEMENTS
  // -------------------------------
  function updateAchievements() {
    const updated = [...achievements];

    const streak = computeStreak();
    const level = profile?.level ?? 0;

    achievementsList.forEach((ach) => {
      const alreadyUnlocked = updated.find((a) => a.id === ach.id);

      // Unlock (LEVEL)
      if (ach.type === "level" && level >= ach.levelRequired) {
        if (!alreadyUnlocked) {
          updated.push({
            ...ach,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          });
        }
      }

      // Unlock (STREAK)
      if (ach.type === "streak" && streak >= ach.streakRequired) {
        if (!alreadyUnlocked) {
          updated.push({
            ...ach,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          });
        }
      }
    });

    setAchievements(updated);
  }

  // Trigger unlock checks when level or streak changes
  useEffect(() => {
    updateAchievements();
  }, [profile?.level, habits]);

  // -------------------------------
  // TOGGLE HABIT COMPLETE
  // -------------------------------
  const toggleHabitComplete = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;

        const alreadyCompleted = habit.completedDates.includes(today);

        const updatedDates = alreadyCompleted
          ? habit.completedDates.filter((d) => d !== today)
          : [...habit.completedDates, today];

        const newStreak = alreadyCompleted
          ? Math.max(0, habit.currentStreak - 1)
          : habit.currentStreak + 1;

        // XP + LEVEL update
        if (!alreadyCompleted) {
          setProfileState((prevProfile) =>
            prevProfile
              ? {
                  ...prevProfile,
                  xp: prevProfile.xp + 10,
                  level: Math.floor((prevProfile.xp + 10) / 100) + 1,
                }
              : prevProfile
          );
        }

        return {
          ...habit,
          completedDates: updatedDates,
          currentStreak: newStreak,
          longestStreak: Math.max(habit.longestStreak, newStreak),
        };
      })
    );
  };

  // -------------------------------
  // UPDATE PROFILE
  // -------------------------------
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileState((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  // -------------------------------
  // CONTEXT PROVIDER
  // -------------------------------
  return (
    <AppContext.Provider
      value={{
        profile,
        habits,
        achievements,
        journeys,
        setProfile,
        addHabit,
        toggleHabitComplete,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// -------------------------------
// HOOK
// -------------------------------
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
