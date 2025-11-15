import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import penguinBlue from "@/assets/penguin-blue.png";

const emojis = ["✨", "💫", "⭐", "🌟", "💖", "🎉"];

const OnboardingName = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (name.trim()) {
      navigate("/onboarding/personality");
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6 relative overflow-hidden">
      {/* Floating emojis */}
      {emojis.map((emoji, i) => (
        <div
          key={i}
          className="absolute text-4xl animate-float opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          {emoji}
        </div>
      ))}

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <span className="font-medium">Step 2 of 3</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Name Your Penguin</h1>
          <p className="text-lg text-muted-foreground">What should we call your new friend?</p>
        </div>

        {/* Penguin Preview */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <img 
              src={penguinBlue} 
              alt="Penguin" 
              className="w-64 h-64 animate-bounce-slow drop-shadow-2xl"
            />
            {name && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 glass rounded-2xl px-6 py-3 animate-scale-in">
                <p className="text-lg font-medium">{name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Name Input */}
        <div className="glass rounded-3xl p-8 mb-6">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name..."
            className="text-center text-2xl h-16 rounded-xl border-2"
            maxLength={20}
            autoFocus
          />
          <p className="text-center text-sm text-muted-foreground mt-4">
            {name.length}/20 characters
          </p>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={() => navigate("/onboarding/color")}
            variant="outline"
            size="lg" 
            className="flex-1 rounded-xl h-14 text-lg glass"
          >
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            size="lg" 
            className="flex-1 rounded-xl h-14 text-lg"
            disabled={!name.trim()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingName;
