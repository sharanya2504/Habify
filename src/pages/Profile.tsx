// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { LogOut, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { APP_TEXT, TOKENS } from "@/data/constants";
import { loadUser, saveUser } from "@/lib/userStorage";
import { loadWeeklyProgress } from "@/lib/weeklyProgressStorage";
import { loadGemHistory } from "@/lib/gemHistoryStorage";

import penguinBlue from "@/assets/penguin-blue.png";

const XP_PER_LEVEL = (lvl: number) => lvl * 100;

const Profile = () => {
  const navigate = useNavigate();

  // -------------------- USER --------------------
  const initial = loadUser() ?? {
    username: "User",
    penguinName: "Buddy",
    penguinAvatar: penguinBlue,
    totalGems: 0,
    currentStreak: 0,
    level: 1,
    xp: 0,
    preferredMood: TOKENS.moods[0],
  };

  const [user, setUser] = useState(initial);
  const xpPercent = Math.min(100, Math.round((user.xp / XP_PER_LEVEL(user.level)) * 100));

  // -------------------- REAL WEEKLY PROGRESS STORAGE --------------------
  const [calendarData, setCalendarData] = useState<{ day: number; status: "none" | "partial" | "full" }[]>([]);

  useEffect(() => {
    const weekly = loadWeeklyProgress(); // {Mon:{completed,total}, ...}

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();

    const arr: { day: number; status: "none" | "partial" | "full" }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = date.toLocaleString("en-US", { weekday: "short" });

      const prog = weekly[key] ?? { completed: 0, total: 0 };

      let status: "none" | "partial" | "full" = "none";

      if (prog.total > 0 && prog.completed === prog.total) status = "full";
      else if (prog.completed > 0) status = "partial";

      arr.push({ day: d, status });
    }

    setCalendarData(arr);
  }, []);

  // -------------------- GEM HISTORY --------------------
  const [gemHistory, setGemHistory] = useState([]);

  useEffect(() => {
    setGemHistory(loadGemHistory());
  }, []);

  // -------------------- SAVE USER --------------------
  useEffect(() => {
    saveUser(user);
  }, [user]);

  const handleLogout = () => navigate("/");

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-10">
        {/* ---------------------------------------------------------
            PROFILE HEADER
        ---------------------------------------------------------- */}
        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 gradient-primary opacity-10 blur-3xl rounded-full" />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 w-full h-full rounded-3xl blur-xl bg-primary/20"></div>

              <img
                src={user.penguinAvatar ?? penguinBlue}
                alt={user.penguinName}
                className="w-32 h-32 rounded-3xl shadow-xl relative z-10"
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <h1 className="text-3xl font-bold">{user.username}</h1>

              <p className="text-lg text-muted-foreground">
                {APP_TEXT.profile.penguinNameLabel}: {user.penguinName}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="glass rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-bold flex items-center gap-2">
                    <Gem className="w-5 h-5 text-gem fill-gem" />
                    {user.totalGems}
                  </p>
                </div>

                <div className="glass rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-bold flex items-center gap-2">
                    {TOKENS.emojis.fire} {user.currentStreak ?? 0}
                  </p>
                </div>

                <div className="glass rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-bold flex items-center gap-2">
                    {APP_TEXT.labels.level} {user.level}
                  </p>
                </div>
              </div>

              {/* XP Bar */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-1">{APP_TEXT.progress.levelProgressLabel}</p>

                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {user.xp}/{XP_PER_LEVEL(user.level)} XP • {xpPercent}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------
            REAL MONTH CALENDAR (Purple = partial, green = full)
        ---------------------------------------------------------- */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">{APP_TEXT.profile.streakCalendarTitle}</h2>

          <div className="grid grid-cols-7 gap-3 text-center">
            {calendarData.map((d) => (
              <div
                key={d.day}
                className="aspect-square flex items-center justify-center rounded-xl glass"
              >
                <span
                  className={`
                    text-lg font-bold
                    ${d.status === "full" ? "text-green-500" : d.status === "partial" ? "text-purple-500" : "text-muted-foreground"}
                  `}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------
            GEM HISTORY LOG — REAL
        ---------------------------------------------------------- */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">{APP_TEXT.profile.gemHistoryTitle}</h2>

          {gemHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">{APP_TEXT.profile.gemHistoryEmpty}</p>
          ) : (
            <div className="space-y-4">
              {gemHistory.map((item: any, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition"
                >
                  <div>
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>

                  <div className="flex items-center gap-2 text-gem font-bold">
                    <Gem className="w-5 h-5 fill-gem" />+{item.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full rounded-xl h-12"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {APP_TEXT.buttons.logout}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
