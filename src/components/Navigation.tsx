// import React from 'react';
// import { Home, Map, Award, Settings, Heart } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';

// export const Navigation: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navItems = [
//     { icon: Home, label: 'Home', path: '/' },
//     { icon: Map, label: 'Journeys', path: '/journeys' },
//     { icon: Heart, label: 'Mood', path: '/mood' },
//     { icon: Award, label: 'Achievements', path: '/achievements' },
//     { icon: Settings, label: 'Settings', path: '/settings' },
//   ];

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg z-50">
//       <div className="flex justify-around items-center px-4 py-3 max-w-lg mx-auto">
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = location.pathname === item.path;
          
//           return (
//             <button
//               key={item.path}
//               onClick={() => navigate(item.path)}
//               className={`flex flex-col items-center gap-1 transition-all duration-300 ${
//                 isActive 
//                   ? 'text-primary scale-110' 
//                   : 'text-muted-foreground hover:text-foreground'
//               }`}
//             >
//               <Icon className="w-6 h-6" />
//               <span className="text-xs font-medium">{item.label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </nav>
//   );
// };


import { NavLink } from "react-router-dom";
import { Home, ListTodo, Users, BarChart2, User } from "lucide-react";

export  function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/70 backdrop-blur-xl border-t border-border shadow-lg z-50">
      <div className="flex justify-around py-3 text-sm text-muted-foreground">

        <NavItem to="/dashboard" icon={<Home className="w-6 h-6" />} label="Home" />
        <NavItem to="/quests" icon={<ListTodo className="w-6 h-6" />} label="Quests" />
        <NavItem to="/friends" icon={<Users className="w-6 h-6" />} label="Friends" />
        <NavItem to="/progress" icon={<BarChart2 className="w-6 h-6" />} label="Progress" />
        <NavItem to="/profile" icon={<User className="w-6 h-6" />} label="Profile" />

      </div>
    </nav>
  );
}

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 transition-all ${
          isActive ? "text-primary font-medium" : "text-muted-foreground"
        }`
      }
    >
      {icon}
      <span className="text-xs">{label}</span>
    </NavLink>
  );
};
