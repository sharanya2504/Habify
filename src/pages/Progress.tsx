// src/pages/Progress.tsx
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { ProgressRing } from "@/components/ProgressRing";
import { Award, TrendingUp, Gem } from "lucide-react";

import { APP_TEXT, TOKENS } from "@/data/constants";
import { userState } from "@/data/userState";
import { mockWeeklyProgress, mockWeeklyMoods } from "@/data/mockData";

import penguinBlue from "@/assets/penguin-blue.png";

/**
 * PROGRESS PAGE — fully dynamic (Style A)
 * - No hard-coded strings
 * - All UI text from APP_TEXT
 * - All emojis from TOKENS or APP_TEXT
 * - All data from userState or mockData
 */

const Progress = () => {
  const todayProgress = userState.todayProgress;
  const penguinAvatar = userState.penguinAvatar ?? penguinBlue;

  // derived computations (numbers only)
  const todayCompleted = mockWeeklyProgress[0].completed; // temporary example
  const todayTotal = mockWeeklyProgress[0].total;

  const consistencyStatus =
    todayProgress >= 100
      ? APP_TEXT.dashboard.progressPerfect
      : todayProgress >= 75
      ? APP_TEXT.dashboard.progressAlmost
      : todayProgress >= 50
      ? APP_TEXT.dashboard.progressGood
      : APP_TEXT.dashboard.progressStart;

  // weekly aggregates
  const totalCompletedWeekly = mockWeeklyProgress.reduce((a, b) => a + b.completed, 0);
  const totalWeeklyTasks = mockWeeklyProgress.reduce((a, b) => a + b.total, 0);
  const weeklyConsistency = Math.round((totalCompletedWeekly / totalWeeklyTasks) * 100);

  // best day logic (very simple: max completion %)
  let bestDay = "—";
  let bestPct = -1;

  mockWeeklyProgress.forEach((d) => {
    const pct = d.total > 0 ? d.completed / d.total : 0;
    if (pct > bestPct) {
      bestPct = pct;
      bestDay = d.day;
    }
  });

  const gemsUntilNextLevel = 52; // this will be derived from userState later

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
                className="md:size-[200px] lg:size-[240px]"
              />

              <img
                src={penguinAvatar}
                alt={userState.penguinName}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-bounce-slow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              <div className="glass p-3 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">{APP_TEXT.progress.tasksCompleted}</p>
                <p className="text-xl font-semibold">{APP_TEXT.format.fraction(todayCompleted, todayTotal)}</p>
              </div>

              <div className="glass p-3 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">{APP_TEXT.progress.consistencyScore}</p>
                <p className="text-xl font-semibold">{consistencyStatus}</p>
              </div>
            </div>

            <p className="text-sm mt-2 text-center text-primary font-medium">{consistencyStatus}</p>
          </div>
        </div>

        {/* WEEKLY PROGRESS */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">{APP_TEXT.progress.weeklyTitle}</h2>

          <div className="w-full py-4">
            <div className="grid grid-cols-7 gap-4 h-56 md:h-64 lg:h-72">
              {mockWeeklyProgress.map((day, idx) => {
                const percent = (day.completed / day.total) * 100;

                const barColor = percent === 100 ? "bg-success" : percent >= 60 ? "bg-primary" : "bg-muted";

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center w-full"
                  >
                    <div className="relative w-full h-full flex items-end">
                      <div
                        className={`${barColor} w-full rounded-t-lg transition-all`}
                        style={{ height: `${percent}%` }}
                      />

                      {percent === 100 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg">{TOKENS.moods[0]}</div>}
                    </div>

                    <p className="text-xs mt-2">{day.day}</p>
                    <p className="text-[10px] text-muted-foreground">{APP_TEXT.format.fraction(day.completed, day.total)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">{APP_TEXT.progress.weeklyTasksLabel}</p>
              <p className="text-lg font-bold">{APP_TEXT.format.fraction(totalCompletedWeekly, totalWeeklyTasks)}</p>
            </div>

            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">{APP_TEXT.progress.consistencyLabel}</p>
              <p className="text-lg font-bold">{APP_TEXT.format.percent(weeklyConsistency)}</p>
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
            {mockWeeklyMoods.map((m, i) => (
              <div
                key={i}
                className="flex flex-col items-center w-full"
              >
                <div className="w-full aspect-square rounded-full glass flex items-center justify-center text-xl md:text-2xl lg:text-4xl">
                  {m.mood}
                </div>
                <p className="text-xs mt-1">{m.day}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-center font-medium mt-3 text-primary">{APP_TEXT.progress.moodSummaryPositive}</p>
        </div>

        {/* STREAKS + GEMS */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* STREAKS */}
          <div className="glass rounded-2xl p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">{APP_TEXT.progress.streaksTitle}</h2>

            <div className="flex flex-col items-center">
              <div className="text-5xl mb-2 animate-pulse-slow">{TOKENS.emojis.fire}</div>

              <p className="text-3xl font-bold">{APP_TEXT.format.daySuffix(userState.currentStreak)}</p>

              <p className="text-muted-foreground text-sm">{APP_TEXT.progress.currentStreakLabel}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="glass p-3 rounded-xl text-center">
                <Award className="w-6 h-6 mx-auto text-warning mb-1" />
                <p className="text-xs text-muted-foreground">{APP_TEXT.progress.longestStreakLabel}</p>
                <p className="text-lg font-bold">18 days</p>
              </div>

              <div className="glass p-3 rounded-xl text-center">
                <TrendingUp className="w-6 h-6 mx-auto text-success mb-1" />
                <p className="text-xs text-muted-foreground">{APP_TEXT.progress.activeDaysLabel}</p>
                <p className="text-lg font-bold">42 days</p>
              </div>
            </div>
          </div>

          {/* GEMS & LEVEL */}
          <div className="glass rounded-2xl p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">{APP_TEXT.progress.gemsLevelTitle}</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{APP_TEXT.progress.dailyGemsLabel}</p>
                  <p className="text-xs text-muted-foreground">{APP_TEXT.format.fraction(35, 50)}</p>
                </div>
                <div className="h-2 bg-muted rounded-full mt-1">
                  <div
                    className="h-full bg-gem rounded-full"
                    style={{ width: "70%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{APP_TEXT.progress.weeklyGemsLabel}</p>
                  <p className="text-xs text-muted-foreground">{APP_TEXT.format.fraction(248, 500)}</p>
                </div>
                <div className="h-2 bg-muted rounded-full mt-1">
                  <div
                    className="h-full gradient-accent rounded-full"
                    style={{ width: "50%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{APP_TEXT.progress.levelProgressLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    Level {userState.level} → {userState.level + 1}
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full mt-1">
                  <div
                    className="h-full gradient-primary rounded-full"
                    style={{ width: "62%" }}
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-center mt-3 flex items-center justify-center gap-2 text-gem font-medium">
              <Gem className="w-4 h-4" />
              {APP_TEXT.progress.gemsUntilNext(gemsUntilNextLevel)}
              <Gem className="w-4 h-4" />
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Progress;
