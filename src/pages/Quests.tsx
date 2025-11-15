import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { QuestCard } from "@/components/QuestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const quests = {
  daily: [
    {
      icon: "💪",
      title: "Consistency Champion",
      description: "Complete all daily tasks for 3 days in a row",
      progress: 2,
      total: 3,
      reward: 50,
      difficulty: "Easy" as const,
    },
    {
      icon: "🔥",
      title: "Streak Master",
      description: "Maintain a 7-day streak on any habit",
      progress: 5,
      total: 7,
      reward: 100,
      difficulty: "Medium" as const,
    },
  ],
  weekly: [
    {
      icon: "🏆",
      title: "Weekly Warrior",
      description: "Complete 30 tasks this week",
      progress: 18,
      total: 30,
      reward: 200,
      difficulty: "Medium" as const,
    },
    {
      icon: "🌟",
      title: "Perfect Week",
      description: "Achieve 100% task completion for 7 days",
      progress: 3,
      total: 7,
      reward: 300,
      difficulty: "Hard" as const,
    },
  ],
  special: [
    {
      icon: "🎯",
      title: "Habit Builder",
      description: "Create and maintain 5 different habits",
      progress: 3,
      total: 5,
      reward: 150,
      difficulty: "Medium" as const,
    },
    {
      icon: "👥",
      title: "Social Butterfly",
      description: "Invite 3 friends to join PenguinPal",
      progress: 1,
      total: 3,
      reward: 250,
      difficulty: "Easy" as const,
    },
    {
      icon: "💎",
      title: "Gem Collector",
      description: "Earn a total of 1000 gems",
      progress: 248,
      total: 1000,
      reward: 500,
      difficulty: "Hard" as const,
    },
  ],
};

const Quests = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />
      
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Quests</h1>
          <p className="text-lg text-muted-foreground">
            Complete quests to earn bonus gems and level up your penguin!
          </p>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass h-14 rounded-2xl mb-8">
            <TabsTrigger value="daily" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="special" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Special
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            {quests.daily.map((quest, i) => (
              <QuestCard key={i} {...quest} />
            ))}
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4">
            {quests.weekly.map((quest, i) => (
              <QuestCard key={i} {...quest} />
            ))}
          </TabsContent>
          
          <TabsContent value="special" className="space-y-4">
            {quests.special.map((quest, i) => (
              <QuestCard key={i} {...quest} />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Quests;
