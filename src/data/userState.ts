// src/data/userState.ts
import penguinBlue from "@/assets/penguin-blue.png";

export const userState = {
  username: "Sarah M.",
  penguinName: "Waddles",
  penguinColor: "blue",
  penguinAvatar: penguinBlue,

  // numeric stats
  totalGems: 248,
  currentStreak: 12,
  level: 8,

  // ADD THESE 2
  xp: 0, // total accumulated XP
  xpToNextLevel: 800, // 100 * current level (8 * 100 = 800)

  todayProgress: 75,

  // small UI-level preferences
  preferredMood: "😊" as string | null,
};
