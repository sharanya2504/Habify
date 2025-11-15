// src/lib/weeklyMoodStorage.ts

const KEY = "pethabit_weekly_moods_v1";

export type WeeklyMood = {
  Mon: string | null;
  Tue: string | null;
  Wed: string | null;
  Thu: string | null;
  Fri: string | null;
  Sat: string | null;
  Sun: string | null;
};

// default empty moods
const EMPTY: WeeklyMood = {
  Mon: null,
  Tue: null,
  Wed: null,
  Thu: null,
  Fri: null,
  Sat: null,
  Sun: null,
};

export function loadWeeklyMoods(): WeeklyMood {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
}

export function saveWeeklyMoods(moods: WeeklyMood) {
  try {
    localStorage.setItem(KEY, JSON.stringify(moods));
  } catch {}
}

// Get "Mon", "Tue"...
export function todayKey(): keyof WeeklyMood {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()] as keyof WeeklyMood;
}

// Update today's mood
export function setTodayMood(mood: string) {
  const moods = loadWeeklyMoods();
  const k = todayKey();
  moods[k] = mood;
  saveWeeklyMoods(moods);
}
