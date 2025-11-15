import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mascot } from "@/components/Mascot";
import { useApp } from "@/contexts/AppContext";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function StreakIntro() {
  const navigate = useNavigate();
  const { profile } = useApp();

  // Redirect if no profile
  useEffect(() => {
    if (!profile) {
      navigate("/onboarding");
    }
  }, [profile, navigate]);

  // Confetti
  useEffect(() => {
    const duration = 500;
    const end = Date.now() + duration;

    (function blast() {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
      });
      if (Date.now() < end) requestAnimationFrame(blast);
    })();
  }, []);

  if (!profile) return null;

  const petName = profile.petName || "your buddy";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">

      {/* Mascot */}
      <Mascot mood="celebrate" size="lg" className="mb-6" />

      {/* MAIN STREAK NUMBER */}
      <h1 className="text-5xl font-extrabold text-primary mb-2">1</h1>
      <p className="text-xl font-semibold text-foreground mb-6">DAY STREAK</p>

      {/* WEEK CIRCLE BAR */}
      <Card className="p-4 bg-primary/10 rounded-2xl w-full max-w-sm mb-6 shadow-md">
        <div className="flex justify-between font-semibold">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={i}
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-sm
                ${i === 0 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "border-primary/40 text-primary/60"
                }`}
            >
              {i === 0 ? "✓" : d}
            </div>
          ))}
        </div>
      </Card>

      {/* MESSAGE */}
      <p className="text-foreground/90 font-medium mb-8 px-6">
        Great start! Keep going with <span className="font-bold">{petName}</span> cheering for you 💜
      </p>

      {/* CONTINUE BUTTON */}
      <Button
        className="px-10 py-4 rounded-full text-lg shadow-lg"
        onClick={() => navigate("/dashboard")}
      >
        Continue →
      </Button>
    </div>
  );
}
