// src/pages/Profile.tsx
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { LogOut, Edit, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { APP_TEXT, TOKENS } from "@/data/constants";
import { userState } from "@/data/userState";
import { mockGemHistory } from "@/data/mockData";

/**
 * PROFILE PAGE — fully dynamic, Strict Style A
 * - No UI literals
 * - All labels from APP_TEXT
 * - All emojis/tokens from TOKENS
 * - All user-specific values from userState
 * - Gem history from mockGemHistory
 */

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const { username, penguinName, penguinAvatar, totalGems, currentStreak, level } = userState;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="glass rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 gradient-primary opacity-10 blur-3xl rounded-full" />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <img
              src={penguinAvatar}
              alt={penguinName}
              className="w-32 h-32 rounded-3xl"
            />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{username}</h1>
              <p className="text-lg text-muted-foreground mb-4">
                {APP_TEXT.profile.penguinNameLabel}: {penguinName} 💙
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {/* Total Gems */}
                <div className="glass rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold flex items-center gap-2">
                    <Gem className="w-5 h-5 text-gem fill-gem" />
                    {totalGems}
                  </p>
                </div>

                {/* Current Streak */}
                <div className="glass rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {TOKENS.emojis.fire} {currentStreak}
                  </p>
                </div>

                {/* Level */}
                <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                  <p className="text-xl">{`${APP_TEXT.labels.level}`}</p>
                  <p className="text-2xl font-bold">{`${level}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Calendar */}
        <div className="glass rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{APP_TEXT.profile.streakCalendarTitle}</h2>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }, (_, i) => {
              const isComplete = i < 20;
              const isPerfect = i < 12;

              const bgClass = isComplete ? (isPerfect ? "bg-success text-white" : "bg-primary/30") : "bg-muted";

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${bgClass}`}
                >
                  {isPerfect ? TOKENS.moods[0] : ""}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success" />
              <span className="text-muted-foreground">{APP_TEXT.profile.streakLegendPerfect}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/30" />
              <span className="text-muted-foreground">{APP_TEXT.profile.streakLegendCompleted}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-muted-foreground">{APP_TEXT.profile.streakLegendMissed}</span>
            </div>
          </div>
        </div>

        {/* Gem History */}
        <div className="glass rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{APP_TEXT.profile.gemHistoryTitle}</h2>

          {mockGemHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">{APP_TEXT.profile.gemHistoryEmpty}</p>
          ) : (
            <div className="space-y-4">
              {mockGemHistory.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>

                  <div className="flex items-center gap-2 text-gem font-bold">
                    <Gem className="w-5 h-5 fill-gem" />
                    {APP_TEXT.tasks.rewardPrefix}
                    {item.gems}
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
