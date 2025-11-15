// src/pages/Quests.tsx
import { useState } from "react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { APP_TEXT } from "@/data/constants";
import { mockQuests } from "@/data/mockData";
import { userState } from "@/data/userState";

/**
 * Quests Page — Single-File Version + Safe Constant Access
 * - No inline text
 * - No inline emojis
 * - Safe: Won't crash even if constants are missing
 */

// ---------- SAFE CONSTANT GETTER ----------
const getText = (path: string, fallback: string = "") => {
  try {
    const parts = path.split(".");
    let obj = APP_TEXT as any;
    for (const p of parts) obj = obj?.[p];
    return obj ?? fallback;
  } catch {
    return fallback;
  }
};

const Quests = () => {
  const [dailyQuests, setDailyQuests] = useState([...mockQuests.daily]);
  const [weeklyQuests, setWeeklyQuests] = useState([...mockQuests.weekly]);
  const [specialQuests, setSpecialQuests] = useState([...mockQuests.special]);

  const handleComplete = (category: "daily" | "weekly" | "special", index: number, reward: number) => {
    userState.totalGems += reward;

    if (category === "daily") {
      setDailyQuests((prev) => prev.filter((_, i) => i !== index));
    } else if (category === "weekly") {
      setWeeklyQuests((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSpecialQuests((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // -------- Quest Card UI (inline) ----------
  const RenderQuest = (quest: any, category: "daily" | "weekly" | "special", index: number) => {
    return (
      <div
        key={index}
        className="glass rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">{quest.icon}</div>

          <div>
            <h3 className="font-bold text-lg">{quest.title}</h3>
            <p className="text-sm text-muted-foreground">{quest.description}</p>

            <p className="text-xs text-muted-foreground mt-1">
              {quest.progress}/{quest.total} • {quest.difficulty}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleComplete(category, index, quest.reward)}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
        >
          {getText("quests.buttons.complete", "Complete")}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{getText("quests.pageTitle", "Quests")}</h1>

          <p className="text-lg text-muted-foreground">{getText("quests.pageSubtitle", "Complete quests to earn rewards.")}</p>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="daily"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 glass h-14 rounded-2xl mb-8">
            <TabsTrigger
              value="daily"
              className="rounded-xl"
            >
              {getText("quests.tabs.daily", "Daily")}
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="rounded-xl"
            >
              {getText("quests.tabs.weekly", "Weekly")}
            </TabsTrigger>
            <TabsTrigger
              value="special"
              className="rounded-xl"
            >
              {getText("quests.tabs.special", "Special")}
            </TabsTrigger>
          </TabsList>

          {/* DAILY */}
          <TabsContent
            value="daily"
            className="space-y-4"
          >
            {dailyQuests.map((quest, i) => RenderQuest(quest, "daily", i))}
          </TabsContent>

          {/* WEEKLY */}
          <TabsContent
            value="weekly"
            className="space-y-4"
          >
            {weeklyQuests.map((quest, i) => RenderQuest(quest, "weekly", i))}
          </TabsContent>

          {/* SPECIAL */}
          <TabsContent
            value="special"
            className="space-y-4"
          >
            {specialQuests.map((quest, i) => RenderQuest(quest, "special", i))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Quests;