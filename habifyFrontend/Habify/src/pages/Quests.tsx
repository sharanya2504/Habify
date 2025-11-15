// src/pages/Quests.tsx
import { useState, useEffect } from "react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext"; // ✅ ADD THIS IMPORT
import { APP_TEXT } from "@/data/constants";

/**
 * Quests Page — Connected to MongoDB Backend
 * - Uses your QuestTemplate + UserQuest structure
 * - Categories: daily, weekly, special
 * - Streak-based completion system
 * - Diamond rewards integration
 */

interface QuestTemplate {
  _id: string;
  name: string;
  description: string;
  type: "daily" | "weekly" | "special";
  goalStreak: number;
  diamonds: number;
}

interface UserQuest {
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

// ---------- SAFE CONSTANT GETTER ----------
const getText = (path: string, fallback: string = "") => {
  try {
    const parts = path.split(".");
    let obj = APP_TEXT as any;
    for (const p of parts) obj = obj?.[p];
    return obj ?? fallback;
  } catch {
    return fallback;
  }
};

const Quests = () => {
  const [quests, setQuests] = useState<UserQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem("userId");
  
  // ✅ ADD THIS: Get updateProfile from AppContext to update diamonds globally
  const { updateProfile, profile } = useApp();

  // Filter quests by category
  const dailyQuests = quests.filter(quest => quest.type === "daily");
  const weeklyQuests = quests.filter(quest => quest.type === "weekly");
  const specialQuests = quests.filter(quest => quest.type === "special");

  // Fetch today's quests from backend
  useEffect(() => {
    const fetchTodaysQuests = async () => {
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First, assign daily quests (this will create or return today's quests)
        const assignResponse = await fetch("http://localhost:3000/api/quests/assign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!assignResponse.ok) {
          throw new Error(`Failed to assign quests: ${assignResponse.status}`);
        }

        const assignData = await assignResponse.json();
        
        // If quests are returned from assignment, use them
        if (assignData.quests) {
          setQuests(assignData.quests);
        } else {
          // Otherwise, fetch today's quests
          const todayResponse = await fetch(`http://localhost:3000/api/quests/today/${userId}`);
          
          if (!todayResponse.ok) {
            throw new Error(`Failed to fetch quests: ${todayResponse.status}`);
          }
          
          const todayData = await todayResponse.json();
          setQuests(todayData.quests || []);
        }

      } catch (err) {
        console.error("Error fetching quests:", err);
        setError(err instanceof Error ? err.message : "Failed to load quests");
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysQuests();
  }, [userId]);

  // Complete a quest - ✅ UPDATED WITH DIAMOND INTEGRATION
  // In your Quests.tsx - update the handleComplete function
const handleComplete = async (userQuestId: string, isCurrentlyCompleted: boolean) => {
  try {
    console.log('🔄 Frontend: Completing quest:', userQuestId, 'Current status:', isCurrentlyCompleted);
    
    const response = await fetch(`http://localhost:3000/api/quests/complete/${userQuestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: !isCurrentlyCompleted
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Frontend: API error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Frontend: API response:', data);
    
    // Update local state with the updated quest
    setQuests(prev => prev.map(quest => 
      quest._id === userQuestId ? data.updatedQuest : quest
    ));

    // UPDATE USER DIAMONDS IN GLOBAL STATE
    if (data.user && data.user.totalDiamonds !== undefined) {
      console.log('💎 Frontend: Updating diamonds to:', data.user.totalDiamonds);
      
      // Update global app state
      updateProfile({
        totalDiamonds: data.user.totalDiamonds,
        totalGems: data.user.totalDiamonds
      });
      
      // Also update localStorage for persistence
      const currentProfile = JSON.parse(localStorage.getItem("rehabit_profile") || "{}");
      const updatedProfile = {
        ...currentProfile,
        totalDiamonds: data.user.totalDiamonds,
        totalGems: data.user.totalDiamonds
      };
      localStorage.setItem("rehabit_profile", JSON.stringify(updatedProfile));
      
      // Show success message if diamonds were awarded
      if (data.diamondsAwarded > 0) {
        setTimeout(() => {
          alert(`🎉 You earned ${data.diamondsAwarded} diamonds! Total: ${data.user.totalDiamonds}`);
        }, 100);
      }
    } else {
      console.log('❌ Frontend: No user data in response');
    }

  } catch (err) {
    console.error('❌ Frontend: Error updating quest:', err);
    alert('Failed to update quest. Please try again.');
    
    // Revert local state on error
    setQuests(prev => prev.map(quest => 
      quest._id === userQuestId ? { ...quest, completed: isCurrentlyCompleted } : quest
    ));
  }
};

  // Get appropriate icon based on quest type and completion
  const getQuestIcon = (quest: UserQuest) => {
    if (quest.completed) return "✅";
    
    switch (quest.type) {
      case "daily": return "📅";
      case "weekly": return "🗓️";
      case "special": return "⭐";
      default: return "🎯";
    }
  };

  // Get difficulty based on goal streak
  const getDifficulty = (goalStreak: number) => {
    if (goalStreak <= 3) return "easy";
    if (goalStreak <= 7) return "medium";
    return "hard";
  };

  // Calculate total potential diamonds
  const totalPotentialDiamonds = quests.reduce((total, quest) => {
    if (!quest.completed && quest.currentStreak >= quest.goalStreak - 1) {
      return total + quest.diamonds;
    }
    return total;
  }, 0);

  // -------- Quest Card UI (inline) ----------
  const RenderQuest = (quest: UserQuest) => {
    const progress = quest.currentStreak;
    const total = quest.goalStreak;
    const isComplete = quest.completed;
    const canComplete = !isComplete;
    const streakComplete = quest.currentStreak >= quest.goalStreak;
    const rewarded = quest.rewarded;
    const readyForReward = !rewarded && progress >= total - 1 && !isComplete;

    return (
      <div
        key={quest._id}
        className={`glass rounded-2xl p-4 flex items-center justify-between transition-all duration-300 ${
          isComplete ? 'opacity-75' : 'hover:shadow-lg hover:scale-[1.02]'
        } ${readyForReward ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}`}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="text-3xl">{getQuestIcon(quest)}</div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{quest.questId.name}</h3>
              {rewarded && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Rewarded
                </span>
              )}
              {readyForReward && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Reward Ready!
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              {quest.questId.description}
            </p>

            <div className="flex items-center gap-4 mb-2">
              <p className="text-xs text-muted-foreground">
                Streak: {progress}/{total} • {getDifficulty(total)}
              </p>
              <div className="flex items-center gap-1 text-yellow-500">
                <span>💎</span>
                <span className="text-sm font-medium">{quest.diamonds}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  streakComplete ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min((progress / total) * 100, 100)}%` }}
              ></div>
            </div>

            {/* Streak info */}
            {readyForReward && (
              <p className="text-xs text-yellow-600 mt-1 font-medium">
                🎉 Complete today to claim {quest.diamonds} diamonds!
              </p>
            )}
            {streakComplete && !rewarded && !readyForReward && (
              <p className="text-xs text-green-600 mt-1">
                Complete to claim {quest.diamonds} diamonds!
              </p>
            )}
            {rewarded && (
              <p className="text-xs text-green-600 mt-1">
                ✅ Reward claimed! +{quest.diamonds} diamonds
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => handleComplete(quest._id, quest.completed)}
          disabled={!canComplete}
          className={`px-4 py-2 rounded-xl font-medium transition min-w-[100px] ${
            canComplete
              ? "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-md"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } ${readyForReward ? 'animate-pulse' : ''}`}
        >
          {isComplete ? "Completed" : "Complete"}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <TopNav />
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-muted-foreground">
              {getText("quests.loading", "Loading your quests...")}
            </p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <TopNav />
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="text-center py-16">
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              {getText("quests.buttons.retry", "Retry")}
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <TopNav />
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="text-center py-16">
            <p className="text-lg text-red-500 mb-4">Please log in to view quests</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            {getText("quests.pageTitle", "Daily Quests")}
          </h1>

          <p className="text-lg text-muted-foreground">
            {getText("quests.pageSubtitle", "Complete daily quests to earn diamonds and build streaks!")}
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-bold">{dailyQuests.length}</h3>
            <p className="text-sm text-muted-foreground">
              {getText("quests.stats.daily", "Daily")}
            </p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🗓️</div>
            <h3 className="font-bold">{weeklyQuests.length}</h3>
            <p className="text-sm text-muted-foreground">
              {getText("quests.stats.weekly", "Weekly")}
            </p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <h3 className="font-bold">{specialQuests.length}</h3>
            <p className="text-sm text-muted-foreground">
              {getText("quests.stats.special", "Special")}
            </p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">💎</div>
            <h3 className="font-bold">{profile?.totalDiamonds || 0}</h3>
            <p className="text-sm text-muted-foreground">
              {getText("quests.stats.diamonds", "Diamonds")}
            </p>
            {totalPotentialDiamonds > 0 && (
              <p className="text-xs text-green-600 mt-1">
                +{totalPotentialDiamonds} available
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass h-14 rounded-2xl mb-8">
            <TabsTrigger value="daily" className="rounded-xl">
              {getText("quests.tabs.daily", "Daily")}
              <span className="ml-2 bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center">
                {dailyQuests.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-xl">
              {getText("quests.tabs.weekly", "Weekly")}
              <span className="ml-2 bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center">
                {weeklyQuests.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="special" className="rounded-xl">
              {getText("quests.tabs.special", "Special")}
              <span className="ml-2 bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center">
                {specialQuests.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* DAILY QUESTS */}
          <TabsContent value="daily" className="space-y-4">
            {dailyQuests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {getText("quests.empty.daily", "No daily quests available. Check back tomorrow!")}
              </div>
            ) : (
              dailyQuests.map(quest => RenderQuest(quest))
            )}
          </TabsContent>

          {/* WEEKLY QUESTS */}
          <TabsContent value="weekly" className="space-y-4">
            {weeklyQuests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {getText("quests.empty.weekly", "No weekly quests available.")}
              </div>
            ) : (
              weeklyQuests.map(quest => RenderQuest(quest))
            )}
          </TabsContent>

          {/* SPECIAL QUESTS */}
          <TabsContent value="special" className="space-y-4">
            {specialQuests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {getText("quests.empty.special", "No special quests available.")}
              </div>
            ) : (
              specialQuests.map(quest => RenderQuest(quest))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Quests;