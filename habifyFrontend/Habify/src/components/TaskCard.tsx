import { Check, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  title: string;
  completed?: boolean;
  reward: number;
  streak?: number;
  onToggle?: () => void;
}

export function TaskCard({ title, completed = false, reward, streak, onToggle }: TaskCardProps) {
  return (
    <div className={cn(
      "glass rounded-2xl p-4 transition-all hover:scale-[1.02]",
      completed && "bg-success/10 border-success/30"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={onToggle}
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
              completed 
                ? "bg-success border-success text-white" 
                : "border-border hover:border-primary"
            )}
          >
            {completed && <Check className="w-4 h-4" />}
          </button>
          
          <div className="flex-1">
            <h3 className={cn("font-medium", completed && "line-through text-muted-foreground")}>
              {title}
            </h3>
            {streak && streak > 0 && (
              <p className="text-xs text-warning flex items-center space-x-1 mt-1">
                <span>🔥</span>
                <span>{streak} day streak</span>
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-gem">
          <Gem className="w-4 h-4 fill-gem" />
          <span className="font-bold text-sm">+{reward}</span>
        </div>
      </div>
    </div>
  );
}
