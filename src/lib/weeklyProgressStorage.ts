// src/lib/weeklyProgressStorage.ts

const KEY = "pethabit_weekly_progress_v1";

// Returns weekday string: "Mon", "Tue" ...
export function getTodayKey(): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
}

export type DayProgress = {
  day: string; // "Mon"
  completed: number; // number of completed tasks
  total: number; // total tasks
};

export type WeeklyProgress = DayProgress[];

// Default empty week
const EMPTY_WEEK: WeeklyProgress = [
  { day: "Mon", completed: 0, total: 0 },
  { day: "Tue", completed: 0, total: 0 },
  { day: "Wed", completed: 0, total: 0 },
  { day: "Thu", completed: 0, total: 0 },
  { day: "Fri", completed: 0, total: 0 },
  { day: "Sat", completed: 0, total: 0 },
  { day: "Sun", completed: 0, total: 0 },
];

// Load from storage
export function loadWeeklyProgress(): WeeklyProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return JSON.parse(JSON.stringify(EMPTY_WEEK));
    const parsed = JSON.parse(raw);

    // Validate array
    if (!Array.isArray(parsed)) return JSON.parse(JSON.stringify(EMPTY_WEEK));

    return parsed;
  } catch {
    return JSON.parse(JSON.stringify(EMPTY_WEEK));
  }
}

// Save
export function saveWeeklyProgress(data: WeeklyProgress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

// Update today’s entry
export function updateTodayProgress(completed: number, total: number) {
  const week = loadWeeklyProgress();
  const today = getTodayKey();

  const idx = week.findIndex((d) => d.day === today);
  if (idx === -1) return;

  week[idx] = {
    day: today,
    completed,
    total,
  };

  saveWeeklyProgress(week);
}
