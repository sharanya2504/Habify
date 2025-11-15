import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserProfile, Habit, Achievement, Journey } from "@/types/habit";

interface AppContextType {
  profile: UserProfile | null;
  habits: Habit[];
  achievements: Achievement[];
  journeys: Journey[];
  setProfile: (profile: UserProfile) => void;
  addHabit: (habit: Habit) => void;
  toggleHabitComplete: (habitId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  refreshHabits: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // -------------------------------
  // PROFILE STATE
  // -------------------------------
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("rehabit_profile");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading profile from localStorage:', error);
      return null;
    }
  });

  // -------------------------------
  // HABITS STATE
  // -------------------------------
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem("rehabit_habits");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading habits from localStorage:', error);
      return [];
    }
  });

  // -------------------------------
  // ACHIEVEMENTS (DYNAMIC + SAVED)
  // -------------------------------
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem("rehabit_achievements");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading achievements from localStorage:', error);
      return [];
    }
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
  // FETCH HABITS FROM BACKEND
  // -------------------------------
  const refreshHabits = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.log('No userId found, skipping habits refresh');
        return;
      }

      console.log('🔄 Fetching habits from backend for user:', userId);
      const response = await fetch(`http://localhost:3000/api/habits/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch habits: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Received habits from backend:', data);
      setHabits(data);
    } catch (error) {
      console.error('❌ Error fetching habits:', error);
    }
  };

  // -------------------------------
  // LOAD HABITS FROM BACKEND ON MOUNT
  // -------------------------------
  useEffect(() => {
    const loadInitialData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId && profile) {
        await refreshHabits();
      }
    };
    
    loadInitialData();
  }, [profile]); // Only run when profile changes

  // -------------------------------
  // SAVE PROFILE TO LOCAL STORAGE
  // -------------------------------
  useEffect(() => {
    try {
      if (profile) {
        localStorage.setItem("rehabit_profile", JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Error saving profile to localStorage:', error);
    }
  }, [profile]);

  // -------------------------------
  // SAVE HABITS TO LOCAL STORAGE
  // -------------------------------
  useEffect(() => {
    try {
      localStorage.setItem("rehabit_habits", JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits to localStorage:', error);
    }
  }, [habits]);

  // -------------------------------
  // SAVE ACHIEVEMENTS TO STORAGE
  // -------------------------------
  useEffect(() => {
    try {
      localStorage.setItem("rehabit_achievements", JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving achievements to localStorage:', error);
    }
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
  // CALCULATE GLOBAL STREAK (For Achievements)
  // -------------------------------
  function computeStreak(): number {
    if (!habits || !habits.length) return 0;

    let streak = 0;
    let cursor = new Date();

    try {
      while (true) {
        const iso = cursor.toISOString().split("T")[0];

        // Check if any habit was completed on this date
        const completedToday = habits.some((h) => {
          // Use the new completed boolean with lastCompleted date
          if (h.completed && h.lastCompleted) {
            try {
              const lastCompletedDate = new Date(h.lastCompleted).toISOString().split("T")[0];
              return lastCompletedDate === iso;
            } catch (error) {
              console.error('Error parsing lastCompleted date:', h.lastCompleted);
              return false;
            }
          }
          return false;
        });

        if (completedToday) {
          streak++;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      }
    } catch (error) {
      console.error('Error computing streak:', error);
    }

    return streak;
  }

  // -------------------------------
  // TOGGLE HABIT COMPLETE (SAFE VERSION)
  // -------------------------------
  const toggleHabitComplete = async (habitId: string) => {
    if (!habitId) {
      console.error('❌ No habitId provided to toggleHabitComplete');
      return;
    }

    try {
      console.log('🔄 AppContext: Starting toggle for habit:', habitId);
      
      // Find the habit first
      const habit = habits.find(h => (h.id === habitId || h._id === habitId));
      if (!habit) {
        console.log('❌ AppContext: Habit not found with ID:', habitId);
        return;
      }

      const newCompletedState = !habit.completed;

      // Update local state immediately for UI responsiveness
      setHabits(prev => {
        const updatedHabits = prev.map(h => 
          (h.id === habitId || h._id === habitId) 
            ? { 
                ...h, 
                completed: newCompletedState,
                taskStreak: newCompletedState ? (h.taskStreak || 0) + 1 : Math.max(0, (h.taskStreak || 0) - 1),
                lastCompleted: newCompletedState ? new Date().toISOString() : h.lastCompleted
              }
            : h
        );
        return updatedHabits;
      });

      // Call backend API
      console.log('🌐 AppContext: Calling backend API to update habit');
      
      const response = await fetch(`http://localhost:3000/api/habits/complete/${habitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ AppContext: Backend response received');

      // Update with backend response
      if (data.habit) {
        setHabits(prev =>
          prev.map(h =>
            (h.id === habitId || h._id === habitId)
              ? { ...h, ...data.habit }
              : h
          )
        );
      }

      // Update user data if returned
      if (data.totalDiamonds !== undefined && profile) {
        setProfileState(prev => 
          prev ? { 
            ...prev, 
            totalDiamonds: data.totalDiamonds,
            totalGems: data.totalDiamonds
          } : prev
        );
      }

      // Update XP
      if (profile) {
        setProfileState(prev => {
          if (!prev) return prev;
          
          const xpChange = newCompletedState ? 10 : -10;
          const newXp = Math.max(0, (prev.xp || 0) + xpChange);
          const newLevel = Math.floor(newXp / 100) + 1;
          
          return {
            ...prev,
            xp: newXp,
            level: newLevel
          };
        });
      }

    } catch (error) {
      console.error('❌ AppContext: Error toggling habit:', error);
      
      // Revert local changes
      setHabits(prev => 
        prev.map(h => 
          (h.id === habitId || h._id === habitId) 
            ? { ...h, completed: !h.completed }
            : h
        )
      );
    }
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
        refreshHabits,
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
  if (!context)
    throw new Error("useApp must be used within AppProvider");

  return context;
};