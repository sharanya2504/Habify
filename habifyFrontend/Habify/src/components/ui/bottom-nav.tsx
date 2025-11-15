import { Home, Scroll, Users, BarChart3, User, Trophy } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { icon: Home, label: "Home", to: "/dashboard" },
  { icon: Scroll, label: "Quests", to: "/quests" },
  { icon: Users, label: "Friends", to: "/friends" },
  { icon: BarChart3, label: "Progress", to: "/progress" },

  // ⭐ NEW — Achievements
  { icon: Trophy, label: "Achievements", to: "/achievements" },

  { icon: User, label: "Profile", to: "/profile" },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/30">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to} // ⭐ FIXED: unique key on each item
            to={item.to}
            className="flex flex-col items-center justify-center text-xs text-muted-foreground hover:text-foreground"
            activeClassName="text-primary font-medium"
          >
            <item.icon className="h-5 w-5 mb-1" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}