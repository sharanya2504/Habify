import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import penguinBlue from "@/assets/penguin-blue.png";
import penguinPink from "@/assets/penguin-pink.png";
import penguinYellow from "@/assets/penguin-yellow.png";
import penguinPurple from "@/assets/penguin-purple.png";

const colors = [
  { name: "Blue", value: "blue", image: penguinBlue, color: "bg-secondary" },
  { name: "Pink", value: "pink", image: penguinPink, color: "bg-accent" },
  { name: "Yellow", value: "yellow", image: penguinYellow, color: "bg-warning" },
  { name: "Purple", value: "purple", image: penguinPurple, color: "bg-primary" },
];

const OnboardingColor = () => {
  const [selectedColor, setSelectedColor] = useState("blue");
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/onboarding/name");
  };

  const selectedPenguin = colors.find(c => c.value === selectedColor);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <span className="font-medium">Step 1 of 3</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Choose Your Penguin's Color</h1>
          <p className="text-lg text-muted-foreground">Pick the color that speaks to you!</p>
        </div>

        {/* Penguin Preview */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl opacity-30" style={{
              background: `radial-gradient(circle, ${selectedPenguin?.color.replace('bg-', 'var(--')})}, transparent)`
            }} />
            <img 
              src={selectedPenguin?.image} 
              alt="Penguin" 
              className="relative w-64 h-64 animate-bounce-slow drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex justify-center gap-6 mb-12">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={cn(
                "w-16 h-16 rounded-2xl transition-all hover:scale-110",
                color.color,
                selectedColor === color.value && "ring-4 ring-foreground scale-110 glow-primary"
              )}
              aria-label={color.name}
            />
          ))}
        </div>

        <Button 
          onClick={handleNext} 
          size="lg" 
          className="w-full rounded-xl h-14 text-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OnboardingColor;
