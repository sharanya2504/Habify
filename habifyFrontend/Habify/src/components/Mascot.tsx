import React from 'react';
import penguinIdle from '@/assets/penguin-idle.png';
import penguinCelebrate from '@/assets/penguin-celebrate.png';

interface MascotProps {
  id?: string;
  mood?: 'idle' | 'celebrate' | 'happy' | 'sleepy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({ mood = 'idle', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  const animationClasses = {
    idle: 'animate-float',
    celebrate: 'animate-celebrate',
    happy: 'animate-bounce-soft',
  };

  const mascotImage = mood === 'celebrate' ? penguinCelebrate : penguinIdle;

  return (
    <div className={`${sizeClasses[size]} ${animationClasses[mood]} ${className}`}>
      <img 
        src={mascotImage} 
        alt="Cute penguin companion" 
        className="w-full h-full object-contain drop-shadow-lg"
      />
    </div>
  );
};
