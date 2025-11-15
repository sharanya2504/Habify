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

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/30 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
            activeClassName="text-primary"
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("h-5 w-5 mb-1", isActive && "text-primary")} />
                <span className={cn("text-xs", isActive ? "text-primary font-medium" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
