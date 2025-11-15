import { useState } from "react";
import { Gem, Plus, Sparkles } from "lucide-react";
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

  const [showMoodPopup, setShowMoodPopup] = useState(false);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress = Math.round((completedTasks / tasks.length) * 100);
  const totalGems = 248;

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const moods = ["😊", "😃", "😌", "😔", "😴", "🤗"];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Pet Card */}
        <div className="glass rounded-3xl p-6 mb-8 relative overflow-hidden">
          {/* Progress in top-right corner */}
          <div className="absolute top-3 right-3 z-20 scale-75 md:scale-90">
            <ProgressRing
              progress={progress}
              size={110}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold mb-1">Waddles</h1>
              <p className="text-base text-muted-foreground mb-4">Your loyal companion 💙</p>

              {/* Gems + Energy */}
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-2">
                  <Gem className="w-5 h-5 text-gem fill-gem glow-gem" />
                  <span className="text-xl font-bold">{totalGems}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xl">⚡</span>
                  <div className="bg-muted rounded-full h-2.5 w-20">
                    <div
                      className="bg-energy h-full rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Mood */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Mood:</span>
                <button
                  onClick={() => setShowMoodPopup(true)}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  😊
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <img
                src={penguinBlue}
                alt="Waddles the Penguin"
                className="w-44 h-44 md:w-56 md:h-56 animate-float drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Daily Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Daily Tasks</h2>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Task
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

      {/* Mood Popup */}
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
                className="text-5xl hover:scale-125 transition-transform p-3 rounded-2xl hover:bg-muted/50"
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
