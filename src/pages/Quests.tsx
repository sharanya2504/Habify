// src/pages/Quests.tsx
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { QuestCard } from "@/components/QuestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { APP_TEXT } from "@/data/constants";
import { mockQuests } from "@/data/mockData";

/**
 * QUESTS PAGE — Strict Style A
 * - No UI literals/text
 * - No inline quest arrays
 * - All strings and labels from APP_TEXT
 * - All quest data from mockQuests
 */

const Quests = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{APP_TEXT.quests.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{APP_TEXT.quests.pageSubtitle}</p>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="daily"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 glass h-14 rounded-2xl mb-8">
            <TabsTrigger
              value="daily"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {APP_TEXT.quests.tabs.daily}
            </TabsTrigger>

            <TabsTrigger
              value="weekly"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {APP_TEXT.quests.tabs.weekly}
            </TabsTrigger>

            <TabsTrigger
              value="special"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {APP_TEXT.quests.tabs.special}
            </TabsTrigger>
          </TabsList>

          {/* DAILY QUESTS */}
          <TabsContent
            value="daily"
            className="space-y-4"
          >
            {mockQuests.daily.map((quest, i) => (
              <QuestCard
                key={i}
                {...quest}
              />
            ))}
          </TabsContent>

          {/* WEEKLY QUESTS */}
          <TabsContent
            value="weekly"
            className="space-y-4"
          >
            {mockQuests.weekly.map((quest, i) => (
              <QuestCard
                key={i}
                {...quest}
              />
            ))}
          </TabsContent>

          {/* SPECIAL QUESTS */}
          <TabsContent
            value="special"
            className="space-y-4"
          >
            {mockQuests.special.map((quest, i) => (
              <QuestCard
                key={i}
                {...quest}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Quests;
