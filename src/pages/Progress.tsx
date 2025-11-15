import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { ProgressRing } from "@/components/ProgressRing";
import { Award, TrendingUp, Gem } from "lucide-react";
import penguinBlue from "@/assets/penguin-blue.png";

const Progress = () => {
  const todayProgress = 75;

  const weeklyData = [
    { day: "Mon", completed: 4, total: 5 },
    { day: "Tue", completed: 5, total: 5 },
    { day: "Wed", completed: 3, total: 5 },
    { day: "Thu", completed: 5, total: 5 },
    { day: "Fri", completed: 4, total: 5 },
    { day: "Sat", completed: 3, total: 4 },
    { day: "Sun", completed: 0, total: 4 },
  ];

  const moods = [
    { day: "Mon", mood: "😊" },
    { day: "Tue", mood: "😃" },
    { day: "Wed", mood: "😌" },
    { day: "Thu", mood: "🤗" },
    { day: "Fri", mood: "😊" },
    { day: "Sat", mood: "😴" },
    { day: "Sun", mood: "😌" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-10">
      <TopNav />

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* --- TODAY HEADER --- */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">Today’s Progress</h2>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <ProgressRing
                progress={todayProgress}
                size={150}
                strokeWidth={10}
              />

              <img
                src={penguinBlue}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 
                -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 animate-bounce-slow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="glass p-3 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">Tasks Completed</p>
                <p className="text-xl font-semibold">3 / 4</p>
              </div>

              <div className="glass p-3 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">Consistency Score</p>
                <p className="text-xl font-semibold">Excellent 🌟</p>
              </div>
            </div>

            <p className="text-sm mt-2 text-center text-primary font-medium">
              {todayProgress >= 100
                ? "Perfect day! 🎉"
                : todayProgress >= 75
                ? "Almost there! 💪"
                : todayProgress >= 50
                ? "Good progress! 🚀"
                : "Finish strong today! ⭐"}
            </p>
          </div>
        </div>

        {/* --- WEEKLY PROGRESS --- */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">Weekly Progress</h2>

          <div className="overflow-x-auto no-scrollbar py-2">
            <div className="flex items-end gap-4 h-48 px-1">
              {weeklyData.map((day, idx) => {
                const percent = (day.completed / day.total) * 100;

                const barColor = percent === 100 ? "bg-success" : percent >= 60 ? "bg-primary" : "bg-muted";

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center w-10"
                  >
                    {/* Bar wrapper */}
                    <div className="relative w-full h-40 flex items-end">
                      {/* Actual bar */}
                      <div
                        className={`${barColor} w-full rounded-t-lg transition-all`}
                        style={{
                          height: `${percent}%`,
                        }}
                      />

                      {/* Emoji for perfect day */}
                      {percent === 100 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg">😊</div>}
                    </div>

                    {/* Labels */}
                    <p className="text-xs mt-2">{day.day}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {day.completed}/{day.total}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">Tasks This Week</p>
              <p className="text-lg font-bold">24/32</p>
            </div>

            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">Consistency</p>
              <p className="text-lg font-bold">85%</p>
            </div>

            <div className="glass p-3 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">Best Day</p>
              <p className="text-lg font-bold">Tue 🎯</p>
            </div>
          </div>
        </div>

        {/* --- MOOD TRACKER --- */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">Mood Tracker</h2>

          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-3 py-2">
              {moods.map((m, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center w-14"
                >
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-xl">{m.mood}</div>
                  <p className="text-xs mt-1">{m.day}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-center font-medium mt-3 text-primary">Mostly positive this week! 💙</p>
        </div>

        {/* --- STREAKS --- */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">Streaks</h2>

          <div className="flex flex-col items-center">
            <div className="text-5xl mb-2 animate-pulse-slow">🔥</div>
            <p className="text-3xl font-bold">12 Days</p>
            <p className="text-muted-foreground text-sm">Current Streak</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="glass p-3 rounded-xl text-center">
              <Award className="w-6 h-6 mx-auto text-warning mb-1" />
              <p className="text-xs text-muted-foreground">Longest Streak</p>
              <p className="text-lg font-bold">18 days</p>
            </div>

            <div className="glass p-3 rounded-xl text-center">
              <TrendingUp className="w-6 h-6 mx-auto text-success mb-1" />
              <p className="text-xs text-muted-foreground">Active Days</p>
              <p className="text-lg font-bold">42 days</p>
            </div>
          </div>
        </div>

        {/* --- GEM PROGRESS --- */}
        <div className="glass rounded-2xl p-4 md:p-6 mb-2">
          <h2 className="text-xl font-bold mb-4">Gems & Level</h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Daily Gems</p>
                <p className="text-xs text-muted-foreground">35/50</p>
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
                <p className="text-sm font-medium">Weekly Gems</p>
                <p className="text-xs text-muted-foreground">248/500</p>
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
                <p className="text-sm font-medium">Level Progress</p>
                <p className="text-xs text-muted-foreground">Level 8 → 9</p>
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
            <Gem className="w-4 h-4" /> 52 gems until next level! <Gem className="w-4 h-4" />
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Progress;
