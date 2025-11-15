// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
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
import { mockTasks, Task as TaskType } from "@/data/mockData";
import { userState as fallbackUserState } from "@/data/userState";

import penguinBlue from "@/assets/penguin-blue.png";

import { loadTasks, saveTasks } from "@/lib/taskStorage";
import { loadUser, saveUser } from "@/lib/userStorage";
import { updateTodayProgress } from "@/lib/weeklyProgressStorage";
import { pushGemEvent } from "@/lib/gemHistoryStorage";

// add these imports
import { loadWeeklyMoods, todayKey as getTodayKey, setTodayMood } from "@/lib/weeklyMoodStorage";

type User = {
  username?: string;
  penguinName?: string;
  penguinAvatar?: string;
  totalGems: number;
  currentStreak?: number;
  level: number;
  xp: number;
  todayProgress?: number;
  preferredMood?: string | null;
};

const XP_PER_LEVEL = (level: number) => level * 100;

const Dashboard: React.FC = () => {
  // ------------ USER ------------
  const storedUser = loadUser();
  const initialUser: User = {
    ...fallbackUserState,
    ...(storedUser ?? {}),
    xp: storedUser && typeof storedUser.xp === "number" ? storedUser.xp : fallbackUserState["xp"] ?? 0,
    level: storedUser && typeof storedUser.level === "number" ? storedUser.level : fallbackUserState["level"] ?? 1,
    totalGems: storedUser && typeof storedUser.totalGems === "number" ? storedUser.totalGems : fallbackUserState["totalGems"] ?? 0,
    preferredMood: storedUser && "preferredMood" in storedUser ? storedUser.preferredMood : fallbackUserState["preferredMood"] ?? TOKENS.moods[0],
    penguinAvatar: (storedUser && storedUser.penguinAvatar) ?? fallbackUserState.penguinAvatar ?? penguinBlue,
  };

  const [user, setUser] = useState<User>(initialUser);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  // weekly moods state (Mon..Sun keys)
  const [weeklyMoods, setWeeklyMoods] = useState<Record<string, string | null>>(() => {
    try {
      return loadWeeklyMoods();
    } catch {
      return {};
    }
  });

  // compute today's key (e.g., "Mon")
  const todayKey = getTodayKey();

  // ------------ TASKS ------------
  const loaded = loadTasks();
  const initialTasks: TaskType[] = loaded && Array.isArray(loaded) ? loaded : mockTasks.map((t) => ({ ...t }));

  const [tasks, setTasks] = useState<TaskType[]>(initialTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    // update weekly progress when tasks change
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    updateTodayProgress(completed, total);
  }, [tasks]);

  // ------------ UI STATE ------------
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newReward, setNewReward] = useState("");
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showLevelUpPopup, setShowLevelUpPopup] = useState<{
    levelGained: number;
  } | null>(null);
  const [showMoodPopup, setShowMoodPopup] = useState(false);

  // ------------ DERIVED VALUES ------------
  const total = tasks.length;
  const completed = tasks.filter((t) => !!t.completed).length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  // ------------ XP + GEM ENGINE (FIXED) ------------
  const awardXpAndGemsFixed = (xpAmount: number, gemsAmount: number) => {
    setUser((prev) => {
      let nextXp = (prev.xp ?? 0) + xpAmount;
      let nextLevel = prev.level ?? 1;
      let leveledUp = 0;
      let leveledDown = 0;

      // level up
      while (nextXp >= XP_PER_LEVEL(nextLevel)) {
        nextXp -= XP_PER_LEVEL(nextLevel);
        nextLevel++;
        leveledUp++;
      }

      // level down
      while (nextXp < 0 && nextLevel > 1) {
        nextXp += XP_PER_LEVEL(nextLevel - 1);
        nextLevel--;
        leveledDown++;
      }

      if (leveledUp > 0) {
        setShowLevelUpPopup({ levelGained: leveledUp });
      }

      return {
        ...prev,
        xp: Math.max(0, nextXp),
        level: nextLevel,
        totalGems: Math.max(0, (prev.totalGems ?? 0) + gemsAmount),
      };
    });
  };

  // ------------ TASK TOGGLE (FIXED) ------------
  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const wasCompleted = !!t.completed;
        const now = !wasCompleted;
        const reward = t.reward ?? 0;

        let newStreak = t.streak ?? 0;

        if (!wasCompleted && now) {
          newStreak += 1;
          awardXpAndGemsFixed(reward, reward);
          pushGemEvent(`Completed: ${t.title}`, reward);
        } else if (wasCompleted && !now) {
          newStreak = Math.max(0, newStreak - 1);
          awardXpAndGemsFixed(-reward, -reward);
          pushGemEvent(`Undo: ${t.title}`, -reward);
        }

        return {
          ...t,
          completed: now,
          streak: newStreak,
        };
      })
    );

    setShowCompletionPopup(true);
    setTimeout(() => setShowCompletionPopup(false), 700);
  };

  // ------------ CREATE TASK ------------
  const handleCreateTask = () => {
    const title = newTitle.trim();
    if (!title) return;

    const reward = Number(newReward) || 0;

    const newTask: TaskType = {
      id: Date.now(),
      title,
      completed: false,
      reward,
      streak: 0,
    };

    setTasks((prev) => [...prev, newTask]);

    setNewTitle("");
    setNewReward("");
    setOpenAddDialog(false);
  };

  // ------------ MOOD ------------
  const selectMood = (m: string) => {
    // save to weekly storage (persists)
    setTodayMood(m);

    // update local state so UI updates immediately
    setWeeklyMoods((prev) => ({ ...(prev ?? {}), [todayKey]: m }));

    // close popup
    setShowMoodPopup(false);
  };

  // ------------ RENDER ------------
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-10">
        {/* -------- PET CARD -------- */}
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* LEFT */}
            <div className="flex flex-col space-y-4 order-2 md:order-1">
              <h1 className="text-3xl font-bold">{user.penguinName ?? fallbackUserState.penguinName}</h1>
              <p className="text-base text-muted-foreground">{APP_TEXT.dashboard.petSubtitle} 💙</p>

              {/* Gems + Energy */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Gem className="w-6 h-6 text-gem fill-gem" />
                  <span className="text-2xl font-bold">{user.totalGems}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{TOKENS.emojis.energy}</span>
                  <div className="bg-muted rounded-full h-3 w-24">
                    <div
                      className="bg-energy h-full rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Mood */}
              <div className="flex items-center space-x-3">
                <span>{APP_TEXT.dashboard.moodLabel}</span>
                <button
                  onClick={() => setShowMoodPopup(true)}
                  className="text-3xl hover:scale-125 transition-transform"
                >
                  {weeklyMoods?.[todayKey] ?? user.preferredMood ?? TOKENS.moods[0]}
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-center gap-4 order-1 md:order-2">
              <div className="relative">
                <ProgressRing
                  progress={progressPercent}
                  size={180}
                />

                <img
                  src={user.penguinAvatar ?? penguinBlue}
                  alt="penguin"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 animate-bounce-slow"
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{user.level}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((user.xp / XP_PER_LEVEL(user.level)) * 100)}% • {user.xp}/{XP_PER_LEVEL(user.level)} XP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* -------- TASKS -------- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{APP_TEXT.dashboard.dailyTasksTitle}</h2>

            <Dialog
              open={openAddDialog}
              onOpenChange={setOpenAddDialog}
            >
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
                  <div>
                    <Label>{APP_TEXT.dashboard.taskNameLabel}</Label>
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <Label>{APP_TEXT.dashboard.taskRewardLabel}</Label>
                    <Input
                      type="number"
                      value={newReward}
                      onChange={(e) => setNewReward(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <Button
                    onClick={handleCreateTask}
                    className="w-full rounded-xl"
                  >
                    {APP_TEXT.dashboard.taskCreateBtn}
                  </Button>
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

      {/* -------- MOOD POPUP -------- */}
      <Dialog
        open={showMoodPopup}
        onOpenChange={setShowMoodPopup}
      >
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>{APP_TEXT.dashboard.moodLabel}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 py-6">
            {TOKENS.moods.map((m) => (
              <button
                key={m}
                onClick={() => selectMood(m)}
                className="text-5xl hover:scale-125 transition-transform p-3 rounded-2xl hover:bg-muted/50"
              >
                {m}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* -------- POPUPS -------- */}

      {showLevelUpPopup && (
        <div
          className="
      fixed inset-0 z-50 
      flex items-center justify-center 
      backdrop-blur-md bg-black/30
      animate-fade-in
    "
        >
          <div
            className="
        bg-white 
        rounded-3xl 
        px-8 py-6 
        shadow-2xl 
        border border-gray-100 
        max-w-sm w-full
        animate-scale-in
      "
          >
            {/* Avatar + Glow */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-primary/20"></div>

                <img
                  src={user.penguinAvatar ?? ""}
                  alt="avatar"
                  className="
              w-20 h-20 
              rounded-2xl 
              shadow-lg 
              relative z-10
            "
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-1">Level Up! ✨</h2>

            {/* Subtitle */}
            <p className="text-center text-gray-500 mb-4">
              You gained <span className="font-semibold">{showLevelUpPopup.levelGained}</span> level(s)
            </p>

            {/* Close button */}
            <button
              onClick={() => setShowLevelUpPopup(null)}
              className="
          w-full mt-2 
          bg-primary text-primary-foreground 
          py-3 rounded-2xl 
          font-medium shadow 
          hover:opacity-90 transition
        "
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Dashboard;
