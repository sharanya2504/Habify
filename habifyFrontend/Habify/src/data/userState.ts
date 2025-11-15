// src/data/userState.ts
// Temporary local user state (will be replaced by global store / API when backend arrives).

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
  todayProgress: 75,

  // small UI-level preferences
  preferredMood: "😊" as string | null,
};
