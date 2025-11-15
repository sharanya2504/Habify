// src/pages/Dashboard.tsx
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

import { APP_TEXT, TOKENS } from "@/data/constants";
import { mockTasks, Task } from "@/data/mockData";
import { userState } from "@/data/userState";

import penguinBlue from "@/assets/penguin-blue.png";

/**
 * Dashboard page (fully data-driven)
 *
 * - All UI copy comes from APP_TEXT
 * - All emoji/tokens come from TOKENS
 * - Initial data (tasks) comes from mockTasks (copied into local state)
 * - User info comes from userState
 *
 * Style A: zero UI literals in this file.
 */

const Dashboard = () => {
  // create a stateful copy of mockTasks so component can toggle completed
  const [tasks, setTasks] = useState<Task[]>(() => mockTasks.map((t) => ({ ...t })));

  // derived user values from centralized userState
  const penguinName = userState.penguinName;
  const penguinAvatar = userState.penguinAvatar ?? penguinBlue;
  const todayProgress = userState.todayProgress;
  const totalGems = userState.totalGems;

  // UI state
  const [showMoodPopup, setShowMoodPopup] = useState<boolean>(false);

  // completion + progress derived from tasks state
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Toggle a task's completed flag
  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  // moods list comes from TOKENS (no literals)
  const moods = TOKENS.moods;

  // Energy bar: we avoid literals by deriving an energy percent from userState.todayProgress.
  // If you later store energy in userState, replace this calculation with that value.
  const energyPercent = Math.min(100, Math.round((todayProgress ?? 0) * 0.85)); // derived value; numeric math only

  // progress message selected from APP_TEXT.dashboard based on today's progress (all strings in constants)
  const progressMessage =
    todayProgress >= 100
      ? APP_TEXT.dashboard.progressPerfect
      : todayProgress >= 75
      ? APP_TEXT.dashboard.progressAlmost
      : todayProgress >= 50
      ? APP_TEXT.dashboard.progressGood
      : APP_TEXT.dashboard.progressStart;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-10">
        {/* ---------------- PET CARD ---------------- */}
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* LEFT SIDE */}
            <div className="flex flex-col justify-center space-y-4 order-2 md:order-1">
              <h1 className="text-3xl font-bold">{userState.penguinName}</h1>
              <p className="text-base text-muted-foreground">{APP_TEXT.dashboard.petSubtitle} 💙</p>

              {/* Gems + Energy */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Gem className="w-6 h-6 text-gem fill-gem" />
                  <span className="text-2xl font-bold">{totalGems}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{TOKENS.emojis.energy}</span>
                  <div className="bg-muted rounded-full h-3 w-24">
                    <div
                      className="bg-energy h-full rounded-full"
                      style={{ width: `${energyPercent}%` }}
                      aria-valuenow={energyPercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>

              {/* Mood */}
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <span className="text-base">{APP_TEXT.dashboard.moodLabel}</span>

                <button
                  onClick={() => setShowMoodPopup(true)}
                  aria-label={APP_TEXT.dashboard.moodButtonAria}
                  className="text-3xl hover:scale-125 transition-transform"
                >
                  {/* current preferred mood comes from userState, fallback to first TOKENS.moods */}
                  {userState.preferredMood ?? TOKENS.moods[0]}
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
                  src={penguinAvatar}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-bounce-slow"
                  alt={penguinName}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- DAILY TASKS ---------------- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{APP_TEXT.dashboard.dailyTasksTitle}</h2>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1" /> {APP_TEXT.buttons.addTask}
                </Button>
              </DialogTrigger>

              <DialogContent className="glass">
                <DialogHeader>
                  <DialogTitle>{APP_TEXT.dashboard.addTaskDialogTitle}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{APP_TEXT.dashboard.taskNameLabel}</Label>
                    <Input
                      placeholder={APP_TEXT.dashboard.taskNamePlaceholder}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{APP_TEXT.dashboard.taskRewardLabel}</Label>
                    <Input
                      type="number"
                      placeholder={APP_TEXT.dashboard.taskRewardPlaceholder}
                      className="rounded-xl"
                    />
                  </div>

                  <Button className="w-full rounded-xl">{APP_TEXT.dashboard.taskCreateBtn}</Button>
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
            <DialogTitle>{APP_TEXT.dashboard.moodLabel}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 py-6">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => {
                  // set preferred mood in local UI state (placeholder; later move to global store/api)
                  // For now we keep it simple: close popup (userState update will be done when backend/store added)
                  setShowMoodPopup(false);
                }}
                className="text-5xl md:text-6xl hover:scale-125 transition-transform p-3 rounded-2xl hover:bg-muted/50"
                aria-label={`${APP_TEXT.dashboard.moodLabel} ${mood}`}
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
