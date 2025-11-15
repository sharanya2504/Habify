import { useState } from "react";
import { Gem, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { ProgressRing } from "@/components/ProgressRing";
import { TaskCard } from "@/components/TaskCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import penguinBlue from "@/assets/penguin-blue.png";

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Morning meditation", completed: true, reward: 10, streak: 5 },
    { id: 2, title: "Drink 8 glasses of water", completed: false, reward: 10, streak: 3 },
    { id: 3, title: "30 min exercise", completed: false, reward: 15, streak: 0 },
    { id: 4, title: "Read for 20 minutes", completed: false, reward: 10, streak: 2 },
  ]);

  const todayProgress = 75;
  const totalGems = 248;
  const [showMoodPopup, setShowMoodPopup] = useState(false);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress = Math.round((completedTasks / tasks.length) * 100);

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const moods = ["😊", "😃", "😌", "😔", "😴", "🤗"];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-10">
        {/* ---------------- PET CARD ---------------- */}
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* LEFT SIDE */}
            <div className="flex flex-col justify-center space-y-4 order-2 md:order-1">
              <h1 className="text-3xl font-bold">Waddles</h1>
              <p className="text-base text-muted-foreground">Your loyal companion 💙</p>

              {/* Gems + Energy */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Gem className="w-6 h-6 text-gem fill-gem" />
                  <span className="text-2xl font-bold">{totalGems}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⚡</span>
                  <div className="bg-muted rounded-full h-3 w-24">
                    <div
                      className="bg-energy h-full rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Mood */}
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <span className="text-base">Mood:</span>

                <button
                  onClick={() => setShowMoodPopup(true)}
                  className="text-3xl hover:scale-125 transition-transform"
                >
                  😊
                </button>
              </div>
            </div>

            {/* RIGHT SIDE (PENGUIN + PROGRESS) */}
            <div className="flex flex-col items-center gap-4 order-1 md:order-2">
              <div className="relative">
                <ProgressRing
                  progress={todayProgress}
                  size={180}
                  className="md:size-[200px] lg:size-[240px]"
                />

                <img
                  src={penguinBlue}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-bounce-slow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- DAILY TASKS ---------------- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Daily Tasks</h2>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Task
                </Button>
              </DialogTrigger>

              <DialogContent className="glass">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Task Name</Label>
                    <Input
                      placeholder="e.g., Morning run"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gem Reward</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      className="rounded-xl"
                    />
                  </div>

                  <Button className="w-full rounded-xl">Create Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                completed={task.completed}
                reward={task.reward}
                streak={task.streak}
                onToggle={() => toggleTask(task.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- MOOD POPUP ---------------- */}
      <Dialog
        open={showMoodPopup}
        onOpenChange={setShowMoodPopup}
      >
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>How are you feeling today?</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 py-6">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setShowMoodPopup(false)}
                className="text-5xl md:text-6xl hover:scale-125 transition-transform p-3 rounded-2xl hover:bg-muted/50"
              >
                {mood}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
