import { Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  icon: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  difficulty: "Easy" | "Medium" | "Hard";
  completed?: boolean;
}

const difficultyColors = {
  Easy: "bg-success/10 text-success border-success/30",
  Medium: "bg-warning/10 text-warning border-warning/30",
  Hard: "bg-destructive/10 text-destructive border-destructive/30",
};

export function QuestCard({ icon, title, description, progress, total, reward, difficulty, completed = false }: QuestCardProps) {
  const percentage = (progress / total) * 100;

  return (
    <div className={cn(
      "glass rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl",
      completed && "opacity-75"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">{icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className={cn("px-3 py-1 rounded-full text-xs font-medium border", difficultyColors[difficulty])}>
          {difficulty}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}/{total}</span>
        </div>
        
        <Progress value={percentage} className="h-2" />
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1 text-gem">
            <Gem className="w-5 h-5 fill-gem" />
            <span className="font-bold">+{reward}</span>
          </div>
          
          <Button 
            size="sm" 
            disabled={completed}
            className="rounded-xl"
          >
            {completed ? "Completed" : "Start"}
          </Button>
        </div>
      </div>
    </div>
  );
}
