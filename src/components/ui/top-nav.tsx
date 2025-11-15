import { Home, Scroll, Users, BarChart3, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", to: "/dashboard" },
  { icon: Scroll, label: "Quests", to: "/quests" },
  { icon: Users, label: "Friends", to: "/friends" },
  { icon: BarChart3, label: "Progress", to: "/progress" },
  { icon: User, label: "Profile", to: "/profile" },
];

export function TopNav() {
  return (
    <nav className="hidden md:block glass border-b border-border/30 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full gradient-primary" />
            <span className="text-xl font-bold">PenguinPal</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all hover:bg-muted/50"
                activeClassName="bg-primary/10 text-primary font-medium"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
