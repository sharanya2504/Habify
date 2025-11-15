import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { LogOut, Edit, Gem, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { APP_TEXT } from "@/data/constants";
import penguinIdle from "@/assets/penguin-idle.png";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Profile() {
  const navigate = useNavigate();
  const { profile, habits, updateProfile } = useApp();

  if (!profile) {
    // If there's no profile, go back to onboarding
    navigate("/onboarding");
    return null;
  }

  // ----------------------------
  // Month navigation
  // ----------------------------
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  const goPrevMonth = () => {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };
  const goNextMonth = () => {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  // ----------------------------
  // Collect all completed day strings (ISO yyyy-mm-dd)
  // ----------------------------
  const completedDates = useMemo(() => {
    const set = new Set<string>();
    habits.forEach((h) => (h.completedDates || []).forEach((d) => set.add(d)));
    return set;
  }, [habits]);

  // ----------------------------
  // Compute current streak (consecutive days up to today)
  // ----------------------------
  const computeStreak = () => {
    let streak = 0;
    let cursor = new Date();
    while (true) {
      const iso = cursor.toISOString().split("T")[0];
      if (completedDates.has(iso)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }
    return streak;
  };
  const currentStreak = computeStreak();

  // ----------------------------
  // Calendar cells for viewed month (with leading & trailing padding)
  // ----------------------------
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startOffset = firstOfMonth.getDay(); // 0..6 (Sun..Sat) — we use Sunday-first calendar
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: Array<{ day: number; iso?: string }> = [];

  // leading empty cells
  for (let i = 0; i < startOffset; i++) cells.push({ day: 0 });

  // month days
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`;
    cells.push({ day: d, iso });
  }

  // trailing empty cells so total cells is a multiple of 7
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let i = 0; i < trailing; i++) cells.push({ day: 0 });

  // ----------------------------
  // Gem history (descending order)
  // ----------------------------
  const gemHistory = Array.from(completedDates)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((date) => ({ date, gems: 10 }));

  // ----------------------------
  // Edit Profile dialog state
  // ----------------------------
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.username);
  const [pet, setPet] = useState(profile.petName);

  const saveEdit = () => {
    updateProfile({ username: name, petName: pet });
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* HEADER */}
        <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 gradient-primary opacity-10 blur-3xl rounded-full" />

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <img
              src={penguinIdle}
              alt={profile.petName}
              className="w-28 h-28 md:w-32 md:h-32 rounded-2xl"
            />

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{profile.username}</h1>
                  <p className="text-sm text-muted-foreground">
                    Penguin: {profile.petName} 💙
                  </p>
                </div>

                <Dialog open={editing} onOpenChange={setEditing}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-xl">
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-sm text-muted-foreground">Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground">Penguin Name</label>
                        <Input value={pet} onChange={(e) => setPet(e.target.value)} className="mt-1" />
                      </div>

                      <div className="flex justify-end gap-2 pt-3">
                        <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                        <Button onClick={saveEdit}>Save</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* small stat chips (icons only) */}
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4 flex-wrap">
                <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
                  <Gem className="w-6 h-6 text-gem fill-gem" />
                  <span className="text-xl font-bold">{profile.totalGems ?? 0}</span>
                </div>

                <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <span className="text-xl font-bold">{currentStreak}</span>
                </div>

                <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xl font-bold">{profile.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===========================
    CALENDAR
============================= */}
<div className="glass rounded-3xl p-6 md:p-8 mb-8">

  <h2 className="text-2xl font-bold mb-6">Monthly Progress</h2>

  {/* Month Title */}
  <p className="text-center text-lg font-semibold mb-4">
    {new Date(viewYear, viewMonth).toLocaleString("default", {
      month: "long",
      year: "numeric",
    })}
  </p>

  {/* Month navigation */}
  <div className="flex justify-between mb-4">
    <Button variant="outline" size="icon" className="rounded-full" onClick={goPrevMonth}>
      <ChevronLeft className="w-5 h-5" />
    </Button>

    <Button variant="outline" size="icon" className="rounded-full" onClick={goNextMonth}>
      <ChevronRight className="w-5 h-5" />
    </Button>
  </div>

  {/* Days Header */}
  <div className="grid grid-cols-7 text-center text-sm mb-1 font-medium">
    {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map((d) => (
      <div key={d}>{d}</div>
    ))}
  </div>

  {/* Calendar Body */}
  <div className="grid grid-cols-7 gap-2 text-sm">
    {cells.map((cell, index) => {
      const active = cell.iso && completedDates.has(cell.iso);

      return (
        <div
          key={index}
          className={`aspect-square flex items-center justify-center rounded-full
            ${
              cell.day === 0
                ? "text-muted-foreground"
                : active
                ? "bg-primary/80 text-white font-semibold"
                : "text-foreground"
            }
          `}
        >
          {cell.day || ""}
        </div>
      );
    })}
  </div>
</div>


        {/* GEM HISTORY */}
        <div className="glass rounded-3xl p-4 md:p-6">
          <h3 className="text-lg font-bold mb-3">Gem History</h3>

          {gemHistory.length === 0 ? (
            <p className="text-muted-foreground">No gem events yet — complete habits to earn gems!</p>
          ) : (
            <div className="space-y-3">
              {gemHistory.map((g, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition">
                  <div>
                    <div className="font-medium">Completed Habit</div>
                    <div className="text-xs text-muted-foreground">{g.date}</div>
                  </div>

                  <div className="flex items-center gap-2 text-gem font-bold">
                    <Gem className="w-4 h-4 fill-gem" />+{g.gems}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <Button variant="destructive" className="w-full rounded-xl h-12" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> {APP_TEXT.buttons?.logout ?? "Logout"}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
