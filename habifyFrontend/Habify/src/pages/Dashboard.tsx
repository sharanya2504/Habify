import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Gem } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mascot } from "@/components/Mascot";
import { HabitCard } from "@/components/HabitCard";
import { ProgressBar } from "@/components/ProgressBar";
import { CompletionDialog } from "@/components/CompletionDialog";
import { Navigation } from "@/components/Navigation";
import { useApp } from "@/contexts/AppContext";

// Navigation
import { TopNav } from "@/components/ui/top-nav";
import { BottomNav } from "@/components/ui/bottom-nav";

import { ProgressRing } from "@/components/ProgressRing";
import penguinBlue from "@/assets/penguin-idle.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, habits, toggleHabitComplete } = useApp();
  const [showCompletion, setShowCompletion] = useState(false);

  // Redirect if no profile
  if (!profile) {
    navigate("/onboarding");
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  const todayHabits = habits.filter((h) => h.frequency === "daily");

  // ✅ FIXED: Use completed (boolean) instead of completedDates array
  const completedToday = todayHabits.filter((h) => h.completed).length;

  const completionPercent =
    todayHabits.length === 0
      ? 0
      : Math.round((completedToday / todayHabits.length) * 100);

  const xpForNextLevel = profile.level * 100;

  // Toggle habit - ✅ FIXED: Handle both id and _id
  const handleToggleHabit = (habitId: string) => {
    console.log('🔘 Toggle clicked for habit ID:', habitId);
    
    const habit = habits.find((h) => h.id === habitId || h._id === habitId);
    console.log('📋 Found habit:', habit?.title, 'Current completed:', habit?.completed);
    
    const isCompleting = habit && !habit.completed; // ✅ Use completed boolean
    console.log('🎯 Is completing (not already completed):', isCompleting);

    toggleHabitComplete(habitId);

    if (isCompleting) {
      setShowCompletion(true);
    }
  };

  // Greeting text
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌞 Good morning";
    if (hour < 18) return "☀️ Good afternoon";
    return "🌙 Good evening";
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 px-4 md:px-0">

      {/* 👆 Top Navbar (Laptop Only) */}
      <TopNav />

      {/* TOP CARD */}
      <Card className="glass-effect rounded-3xl p-6 mt-6 relative overflow-hidden max-w-lg mx-auto">

        {/* Progress Ring */}
        <div className="absolute top-4 right-4 scale-75 md:scale-90 z-20">
          <ProgressRing progress={completionPercent} size={110} />
        </div>

        {/* Greeting */}
        <h1 className="text-2xl font-bold mb-1">
          {getGreeting()}, {profile.username}!
        </h1>

        <p className="text-sm text-muted-foreground mb-4">
          You're doing amazing today 💜
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">

          {/* Penguin */}
          <div className="flex items-center justify-center">
            <img
              src={penguinBlue}
              alt="Penguin"
              className="w-40 h-40 md:w-48 md:h-48 animate-float drop-shadow-xl"
            />
          </div>

          {/* Stats */}
          <div className="flex flex-col space-y-4">

            {/* Level & XP */}
            <div>
              <p className="text-sm text-muted-foreground">Level {profile.level}</p>
              <p className="text-2xl font-bold text-primary">{profile.xp} XP</p>

              <ProgressBar
                current={profile.xp % xpForNextLevel}
                max={xpForNextLevel}
                label={`${xpForNextLevel - (profile.xp % xpForNextLevel)} XP to Level ${
                  profile.level + 1
                }`}
              />
            </div>

            {/* Streak + Gems Row */}
            <div className="grid grid-cols-2 gap-6">

              {/* Streak */}
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                {/* ✅ FIXED: Use taskStreak instead of currentStreak */}
                <p className="text-2xl font-bold text-secondary flex items-center gap-1">
                  {Math.max(...habits.map((h) => h.taskStreak || 0), 0)} 🔥
                </p>
              </div>

              {/* Gems */}
              <div>
                <p className="text-sm text-muted-foreground">Gems</p>
                <p className="text-2xl font-bold flex items-center gap-2 text-gem">
                  <Gem className="w-5 h-5 text-gem fill-gem" />
                  {profile.totalGems ?? profile.totalDiamonds ?? 0}
                </p>
              </div>

            </div>

          </div>
        </div>
      </Card>

      {/* DAILY HABITS */}
      <div className="max-w-lg mx-auto mt-8 space-y-3">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Today's Habits</h2>
          <span className="text-sm text-muted-foreground">
            {completedToday}/{todayHabits.length}
          </span>
        </div>

        {/* If No Habits */}
        {todayHabits.length === 0 ? (
          <Card className="p-8 text-center glass-effect">
            <p className="text-muted-foreground mb-4">
              No habits yet! Let's create one!
            </p>
            <Button
              onClick={() => navigate("/create-habit")}
              className="bg-primary text-primary-foreground rounded-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Habit
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayHabits.map((habit) => {
              // ✅ FIXED: Use _id as key (MongoDB's default)
              const habitId = habit._id || habit.id;
              console.log('🔄 Rendering habit:', habit.title, 'ID:', habitId, 'completed:', habit.completed);
              return (
                <HabitCard
                  key={habitId} // ✅ Now using the correct unique key
                  habit={habit}
                  onToggle={() => handleToggleHabit(habitId)}
                />
              );
            })}
          </div>
        )}

        {/* Add Habit Button */}
        {todayHabits.length > 0 && (
          <Button
            onClick={() => navigate("/create-habit")}
            className="w-full bg-primary text-primary-foreground py-6 rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Habit
          </Button>
        )}
      </div>

      {/* Completion Popup */}
      <CompletionDialog
        open={showCompletion}
        onClose={() => setShowCompletion(false)}
        xpGained={10}
      />

      {/* 👇 Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  );
}