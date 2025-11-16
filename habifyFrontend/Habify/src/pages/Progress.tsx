import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ProgressBar";
import { TopNav } from "@/components/ui/top-nav";
import { BottomNav } from "@/components/ui/bottom-nav";

export default function Progress() {
  const { habits, profile } = useApp();

  if (!profile) {
    return <div>Please log in to view progress</div>;
  }

  // ✅ FIXED: Use completed (boolean) instead of completedDates.includes()
  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  // Calculate streaks - ✅ FIXED: Use taskStreak instead of currentStreak
  const currentStreaks = habits.map(habit => habit.taskStreak || 0);
  const longestCurrentStreak = Math.max(...currentStreaks, 0);
  const averageStreak = currentStreaks.length > 0 
    ? Math.round(currentStreaks.reduce((a, b) => a + b, 0) / currentStreaks.length) 
    : 0;

  // Calculate weekly completion - ✅ FIXED: Use new data structure
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  
  // ✅ FIXED: Safe calculation for weekly progress
  const weeklyProgress = last7Days.map(day => {
    const habitsCompletedOnDay = habits.filter(habit => {
      // Use the new completed boolean with lastCompleted date
      if (habit.completed && habit.lastCompleted) {
        const completedDate = new Date(habit.lastCompleted).toISOString().split('T')[0];
        return completedDate === day;
      }
      // Fallback for legacy data
      if (habit.completedDates && Array.isArray(habit.completedDates)) {
        return habit.completedDates.includes(day);
      }
      return false;
    }).length;
    
    return {
      date: day,
      completed: habitsCompletedOnDay,
      total: habits.length,
      percentage: habits.length === 0 ? 0 : Math.round((habitsCompletedOnDay / habits.length) * 100)
    };
  });

  // Habit performance - ✅ FIXED: Use new property names
  const habitPerformance = habits.map(habit => ({
    name: habit.title, // Use title instead of name
    emoji: habit.emoji,
    completionRate: habit.taskStreak > 0 ? Math.min(100, (habit.taskStreak / 30) * 100) : 0, // Estimate based on streak
    streak: habit.taskStreak || 0,
    color: habit.color
  }));

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground mb-8">Track your habit journey and statistics</p>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
            <p className="text-3xl font-bold text-primary">{completionRate}%</p>
            <p className="text-sm text-muted-foreground">
              {completedHabits}/{totalHabits} habits completed
            </p>
          </Card>

          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Longest Streak</h3>
            <p className="text-3xl font-bold text-secondary">{longestCurrentStreak} days</p>
            <p className="text-sm text-muted-foreground">Current best streak</p>
          </Card>

          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Average Streak</h3>
            <p className="text-3xl font-bold text-accent">{averageStreak} days</p>
            <p className="text-sm text-muted-foreground">Across all habits</p>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">7-Day Progress</h2>
          <div className="space-y-4">
            {weeklyProgress.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <div className="flex items-center gap-4 w-48">
                  <span className="text-sm font-medium w-20">
                    {index === 6 ? 'Today' : 
                     index === 5 ? 'Yesterday' : 
                     new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {day.completed}/{day.total}
                  </span>
                </div>
                <ProgressBar
                  current={day.completed}
                  max={day.total}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Habit Performance */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Habit Performance</h2>
          <div className="space-y-4">
            {habitPerformance.map((habit, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{habit.emoji}</span>
                  <span className="font-medium">{habit.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-3 w-48">
                  <ProgressBar
                    current={habit.completionRate}
                    max={100}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">
                    {Math.round(habit.completionRate)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}