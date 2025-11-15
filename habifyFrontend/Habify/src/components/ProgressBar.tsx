import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showNumbers?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  max, 
  label, 
  showNumbers = true 
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showNumbers && (
            <span className="text-xs text-muted-foreground">
              {current} / {max}
            </span>
          )}
        </div>
      )}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
