import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Habit } from '@/types/habit';
import { Button } from '@/components/ui/button';

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onDelete?: () => void; // ✅ Add onDelete prop
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onDelete }) => {
  // ✅ FIXED: Use completed (boolean) instead of completedDates array
  const isCompleted = habit.completed;

  console.log('💳 HabitCard rendering:', habit.title, 'completed:', isCompleted, 'onDelete available:', !!onDelete);

  const colorClasses = {
    lavender: 'from-lavender to-primary',
    mint: 'from-mint to-secondary',
    peach: 'from-peach to-lavender',
    sky: 'from-sky to-accent',
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the toggle
    console.log('🗑️ Delete button clicked for:', habit.title);
    if (onDelete) {
      onDelete();
    } else {
      console.error('❌ onDelete function not provided');
    }
  };

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] relative group ${
        isCompleted ? 'opacity-75 shadow-inner' : 'shadow-md'
      }`}
      onClick={() => {
        console.log('🖱️ Card clicked for:', habit.title);
        onToggle();
      }}
    >
      {/* Delete Button - appears on hover */}
      {onDelete && (
        <Button
          variant="destructive"
          size="sm"
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 h-8 w-8 rounded-full shadow-lg z-10"
          onClick={handleDelete}
          title="Delete habit"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
      
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClasses[habit.color as keyof typeof colorClasses] || colorClasses.lavender} flex items-center justify-center text-2xl shadow-sm`}>
          {habit.emoji}
        </div>
        
        <div className="flex-1">
          {/* ✅ FIXED: Use title instead of name */}
          <h3 className="font-semibold text-foreground">{habit.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {/* ✅ FIXED: Use taskStreak instead of currentStreak */}
            <span className="text-xs text-muted-foreground">🔥 {habit.taskStreak || 0} day streak</span>
          </div>
        </div>

        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          isCompleted 
            ? 'bg-primary border-primary' 
            : 'border-border bg-background hover:border-primary'
        }`}>
          {isCompleted && <Check className="w-5 h-5 text-primary-foreground" />}
        </div>
      </div>
    </Card>
  );
};