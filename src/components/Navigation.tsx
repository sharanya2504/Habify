import React from 'react';
import { Home, Map, Award, Settings, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Journeys', path: '/journeys' },
    { icon: Heart, label: 'Mood', path: '/mood' },
    { icon: Award, label: 'Achievements', path: '/achievements' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg z-50">
      <div className="flex justify-around items-center px-4 py-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive 
                  ? 'text-primary scale-110' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
