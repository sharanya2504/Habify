// src/pages/Achievements.tsx

import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock } from "lucide-react";

import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";

export default function Achievements() {
  const { achievements } = useApp();

  const levelAchievements = achievements.filter(a => a.type === "level");
  const streakAchievements = achievements.filter(a => a.type === "streak");

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopNav />

      <div className="max-w-md mx-auto px-6 py-8 space-y-6">

        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold">Your Wins 🏆</h1>
          <p className="text-muted-foreground text-sm">
            Celebrate every milestone!
          </p>
        </div>

        <Tabs defaultValue="levels" className="w-full">
          <TabsList className="grid grid-cols-2 rounded-xl glass">
            <TabsTrigger value="levels" className="rounded-xl">
              Levels
            </TabsTrigger>
            <TabsTrigger value="streaks" className="rounded-xl">
              Streaks
            </TabsTrigger>
          </TabsList>

          {/* LEVEL ACHIEVEMENTS */}
          <TabsContent value="levels" className="mt-4 space-y-3">
            {levelAchievements.map((ach) => (
              <Card
                key={ach.id}
                className={`p-6 rounded-3xl border-2 ${
                  ach.unlocked
                    ? "bg-card border-border"
                    : "bg-muted/50 border-muted opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl relative">
                    {ach.icon}
                    {!ach.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold">{ach.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {ach.description}
                    </p>

                    {ach.unlocked && (
                      <p className="text-xs text-primary mt-1">
                        Unlocked: {new Date(ach.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {ach.unlocked && <div className="text-2xl">✓</div>}
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* STREAK ACHIEVEMENTS */}
          <TabsContent value="streaks" className="mt-4 space-y-3">
            {streakAchievements.map((ach) => (
              <Card
                key={ach.id}
                className={`p-6 rounded-3xl border-2 ${
                  ach.unlocked
                    ? "bg-card border-border"
                    : "bg-muted/50 border-muted opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl relative">
                    {ach.icon}
                    {!ach.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold">{ach.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {ach.description}
                    </p>

                    {ach.unlocked && (
                      <p className="text-xs text-primary mt-1">
                        Unlocked: {new Date(ach.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {ach.unlocked && <div className="text-2xl">✓</div>}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Motivation card */}
        <Card className="p-6 rounded-3xl border-2 glass bg-card/20">
          <div className="text-center space-y-2">
            <div className="text-4xl">🌟</div>
            <h3 className="font-bold">Keep going!</h3>
            <p className="text-sm text-muted-foreground">
              Every great achievement starts with a single step.
            </p>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}