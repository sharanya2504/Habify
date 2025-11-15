// src/pages/Progress.tsx
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { ProgressRing } from "@/components/ProgressRing";
import { Award, TrendingUp, Gem } from "lucide-react";

import { APP_TEXT, TOKENS } from "@/data/constants";
import { loadUser } from "@/lib/userStorage";
import { loadWeeklyProgress } from "@/lib/weeklyProgressStorage";
import { loadWeeklyMoods } from "@/lib/weeklyMoodStorage";

import penguinBlue from "@/assets/penguin-blue.png";

export default function Progress() {
  const user = loadUser() ?? {};
  const weekly = loadWeeklyProgress();
  const weeklyMoods = loadWeeklyMoods();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const penguinAvatar = user.penguinAvatar ?? penguinBlue;
  const todayProgress = Math.round(
    ((weekly.find((d) => d.day === ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()])?.completed ?? 0) /
      (weekly.find((d) => d.day === ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()])?.total || 1)) *
      100
  );

  // Weekly aggregates
  const totalCompletedWeekly = weekly.reduce((s, d) => s + d.completed, 0);
  const totalWeeklyTasks = weekly.reduce((s, d) => s + d.total, 0);
  const weeklyConsistency = totalWeeklyTasks === 0 ? 0 : Math.round((totalCompletedWeekly / totalWeeklyTasks) * 100);

  // best day (highest completion %)
  let bestDay = "—";
  let bestPct = -1;

  weekly.forEach((day) => {
    const pct = day.total > 0 ? day.completed / day.total : 0;
    if (pct > bestPct) {
      bestPct = pct;
      bestDay = day.day;
    }
  });

  const todayEntry = weekly.find((d) => d.day === ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()]) ?? {
    completed: 0,
    total: 0,
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-10">
      <TopNav />

      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* TODAY */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">{APP_TEXT.progress.todayTitle}</h2>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <ProgressRing
                progress={todayProgress}
                size={180}
              />

              <img
                src={penguinAvatar}
                alt={user.penguinName}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-bounce-slow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              <div className="glass p-3 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">{APP_TEXT.progress.tasksCompleted}</p>
                <p className="text-xl font-semibold">
                  {todayEntry.completed}/{todayEntry.total}
                </p>
              </div>

              <div className="glass p-3 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">{APP_TEXT.progress.consistencyScore}</p>
                <p className="text-xl font-semibold">{todayProgress}%</p>
              </div>
            </div>
          </div>
        </div>
        {/* WEEKLY */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">{APP_TEXT.progress.weeklyTitle}</h2>

          <div className="w-full py-4">
            <div className="grid grid-cols-7 gap-4 h-56 md:h-64 lg:h-72">
              {weekly.map((day, idx) => {
                const pct = day.total === 0 ? 0 : (day.completed / day.total) * 100;
                const barColor = pct === 100 ? "bg-success" : pct >= 60 ? "bg-primary" : "bg-muted";

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center w-full"
                  >
                    <div className="relative w-full h-full flex items-end">
                      <div
                        className={`${barColor} w-full rounded-t-lg transition-all`}
                        style={{ height: `${pct}%` }}
                      />
                      {pct === 100 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg">{TOKENS.moods[0]}</div>}
                    </div>

                    <p className="text-xs mt-2">{day.day}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {day.completed}/{day.total}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">{APP_TEXT.progress.weeklyTasksLabel}</p>
              <p className="text-lg font-bold">
                {totalCompletedWeekly}/{totalWeeklyTasks}
              </p>
            </div>

            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">{APP_TEXT.progress.consistencyLabel}</p>
              <p className="text-lg font-bold">{weeklyConsistency}%</p>
            </div>

            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">{APP_TEXT.progress.bestDayLabel}</p>
              <p className="text-lg font-bold">{bestDay}</p>
            </div>
          </div>
        </div>

        {/* MOOD TRACKER */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">{APP_TEXT.progress.moodTrackerTitle}</h2>

          <div className="grid grid-cols-7 gap-4 md:gap-6 w-full">
            {days.map((day) => (
              <div
                key={day}
                className="flex flex-col items-center w-full"
              >
                <div className="w-full aspect-square rounded-full glass flex items-center justify-center text-2xl">{weeklyMoods[day] ?? "—"}</div>
                <p className="text-xs mt-1">{day}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-center mt-3 text-primary font-medium">{APP_TEXT.progress.moodSummaryPositive}</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
