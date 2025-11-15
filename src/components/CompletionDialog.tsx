
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Mascot } from './Mascot';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import confetti from "canvas-confetti";

interface CompletionDialogProps {
  open: boolean;
  onClose: () => void;
  xpGained: number;
}

export const CompletionDialog: React.FC<CompletionDialogProps> = ({ open, onClose, xpGained }) => {

  // Light quick confetti pop
  if (open) {
    confetti({
      particleCount: 35,
      spread: 40,
      origin: { y: 0.7 },
      ticks: 80
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md text-center border-none bg-white p-8 
                   shadow-xl rounded-2xl backdrop-blur-md bg-opacity-30"
      >
        <div className="flex flex-col items-center gap-4">

          <Mascot mood="celebrate" size="lg" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Amazing! 🎉</h2>
            <p className="text-foreground/90">I'm so proud of you!</p>
          </div>

          <div className="flex items-center gap-2 bg-white/90 px-6 py-3 rounded-full shadow-md">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg text-primary">+{xpGained} XP</span>
          </div>

          <Button 
            onClick={onClose}
            className="mt-4 bg-primary hover:bg-primary/90 
                       text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
