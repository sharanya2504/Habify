import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { ProgressRingPeng } from "@/components/ProgressRingPeng";

import { Award, TrendingUp, Gem } from "lucide-react";

import { APP_TEXT, TOKENS } from "@/data/constants";
import { useApp } from "@/contexts/AppContext";

import penguinIdle from "@/assets/penguin-idle.png";

export default function Progress() {
  const { habits, profile } = useApp();

  const penguinAvatar = penguinIdle;

  const todayIso = new Date().toISOString().split("T")[0];

  const todayCompleted = habits.filter(h => h.completedDates.includes(todayIso)).length;
  const todayTotal = habits.length;

  const todayProgress = 
    todayTotal === 0 ? 0 : Math.round((todayCompleted / todayTotal) * 100);

  const consistencyStatus =
    todayProgress >= 100
      ? APP_TEXT.dashboard.progressPerfect
      : todayProgress >= 75
      ? APP_TEXT.dashboard.progressAlmost
      : todayProgress >= 50
      ? APP_TEXT.dashboard.progressGood
      : APP_TEXT.dashboard.progressStart;

  // ----------------------
  // WEEKLY REAL PROGRESS
  // ----------------------
  function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const iso = d.toISOString().split("T")[0];
      const completed = habits.filter(h => h.completedDates.includes(iso)).length;

      days.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        completed,
        total: habits.length
      });
    }
    return days;
  }

  const weekly = getLast7Days();

  const totalCompletedWeekly = weekly.reduce((a, b) => a + b.completed, 0);
  const totalWeeklyTasks = weekly.reduce((a, b) => a + b.total, 0);
  const weeklyConsistency =
    totalWeeklyTasks === 0
      ? 0
      : Math.round((totalCompletedWeekly / totalWeeklyTasks) * 100);

  // Best day
  let bestDay = "—";
  let bestPct = -1;
  weekly.forEach(d => {
    const pct = d.total > 0 ? d.completed / d.total : 0;
    if (pct > bestPct) {
      bestPct = pct;
      bestDay = d.day;
    }
  });

  // ----------------------
  // REAL STREAK
  // ----------------------
  function computeStreak() {
    let streak = 0;
    let cursor = new Date();

    while (true) {
      const iso = cursor.toISOString().split("T")[0];
      const hasCompletion =
        habits.filter(h => h.completedDates.includes(iso)).length > 0;

      if (hasCompletion) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }
    return streak;
  }

  const currentStreak = computeStreak();

  // Real gems from profile
  const totalGems = profile?.totalGems ?? 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-10">
      <TopNav />

      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">

        {/* TODAY SECTION */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">{APP_TEXT.progress.todayTitle}</h2>

          <div className="flex flex-col items-center gap-4">

            <ProgressRingPeng
              progress={todayProgress}
              size={180}
              penguin={penguinAvatar}
            />

            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              <div className="glass p-3 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">
                  {APP_TEXT.progress.tasksCompleted}
                </p>
                <p className="text-xl font-semibold">
                  {APP_TEXT.format.fraction(todayCompleted, todayTotal)}
                </p>
              </div>

              <div className="glass p-3 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">
                  {APP_TEXT.progress.consistencyScore}
                </p>
                <p className="text-xl font-semibold">{consistencyStatus}</p>
              </div>
            </div>

            <p className="text-sm mt-2 text-center text-primary font-medium">
              {consistencyStatus}
            </p>
          </div>
        </div>

        {/* WEEKLY PROGRESS */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">{APP_TEXT.progress.weeklyTitle}</h2>

          <div className="w-full py-4">
            <div className="grid grid-cols-7 gap-4 h-56 md:h-64 lg:h-72">
              {weekly.map((day, idx) => {
                const percent = (day.total === 0 ? 0 : (day.completed / day.total) * 100);
                const barColor =
                  percent === 100 ? "bg-success" : percent >= 60 ? "bg-primary" : "bg-muted";

                return (
                  <div key={idx} className="flex flex-col items-center w-full">
                    <div className="relative w-full h-full flex items-end">
                      <div
                        className={`${barColor} w-full rounded-t-lg transition-all`}
                        style={{ height: `${percent}%` }}
                      />
                      {percent === 100 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg">
                          {TOKENS.moods[0]}
                        </div>
                      )}
                    </div>

                    <p className="text-xs mt-2">{day.day}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {APP_TEXT.format.fraction(day.completed, day.total)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">
                {APP_TEXT.progress.weeklyTasksLabel}
              </p>
              <p className="text-lg font-bold">
                {APP_TEXT.format.fraction(totalCompletedWeekly, totalWeeklyTasks)}
              </p>
            </div>

            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">
                {APP_TEXT.progress.consistencyLabel}
              </p>
              <p className="text-lg font-bold">
                {APP_TEXT.format.percent(weeklyConsistency)}
              </p>
            </div>

            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">
                {APP_TEXT.progress.bestDayLabel}
              </p>
              <p className="text-lg font-bold">{bestDay}</p>
            </div>
          </div>
        </div>

        {/* STREAKS + GEMS */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* STREAKS */}
          <div className="glass rounded-2xl p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">{APP_TEXT.progress.streaksTitle}</h2>

            <div className="flex flex-col items-center">
              <div className="text-5xl mb-2 animate-pulse-slow">{TOKENS.emojis.fire}</div>

              <p className="text-3xl font-bold">
                {APP_TEXT.format.daySuffix(currentStreak)}
              </p>

              <p className="text-muted-foreground text-sm">
                {APP_TEXT.progress.currentStreakLabel}
              </p>
            </div>
          </div>

          {/* GEMS */}
          <div className="glass rounded-2xl p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">{APP_TEXT.progress.gemsLevelTitle}</h2>

            <p className="text-3xl font-bold text-center mb-2">
              {totalGems} <Gem className="inline w-6 h-6 text-gem" />
            </p>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
