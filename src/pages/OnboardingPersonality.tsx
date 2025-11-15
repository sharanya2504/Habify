import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import penguinBlue from "@/assets/penguin-blue.png";

const questions = [
  {
    id: 1,
    question: "What time do you usually wake up?",
    placeholder: "e.g., 7:00 AM",
    bubble: "I want to know your schedule! 🌅",
  },
  {
    id: 2,
    question: "What's your main goal right now?",
    placeholder: "e.g., Stay healthy",
    bubble: "Let's dream together! ✨",
  },
  {
    id: 3,
    question: "How often do you want to check in?",
    placeholder: "e.g., Twice a day",
    bubble: "I'm here whenever you need! 💙",
  },
  {
    id: 4,
    question: "What motivates you the most?",
    placeholder: "e.g., Progress tracking",
    bubble: "Tell me what drives you! 🚀",
  },
  {
    id: 5,
    question: "What's your favorite reward type?",
    placeholder: "e.g., Visual progress",
    bubble: "How should I celebrate with you? 🎉",
  },
  {
    id: 6,
    question: "Any habits you want to start with?",
    placeholder: "e.g., Morning exercise",
    bubble: "Let's start your journey! 🌟",
  },
];

const OnboardingPersonality = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const navigate = useNavigate();

  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/onboarding/name");
    }
  };

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <span className="font-medium">
              Step 3 of 3 • Question {currentStep + 1}/{questions.length}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Let's Get to Know Each Other</h1>
        </div>

        {/* Penguin + Speech Bubble */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center relative">
            {/* Speech Bubble ABOVE the penguin */}
            <div className="glass rounded-xl px-4 py-2 mb-2 max-w-[160px] text-center animate-scale-in">
              <p className="text-xs font-medium">{currentQuestion.bubble}</p>

              {/* Bubble tail */}
              <div
                className="mx-auto w-0 h-0 
        border-l-6 border-l-transparent 
        border-r-6 border-r-transparent 
        border-t-6 border-t-white/60"
              />
            </div>

            {/* Penguin */}
            <img
              src={penguinBlue}
              alt="Penguin"
              className="w-40 h-40 object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass rounded-3xl p-8 mb-6 transition-all animate-scale-in">
          <div className="space-y-4">
            <Label className="text-xl font-bold">{currentQuestion.question}</Label>
            <Input
              type="text"
              value={answers[currentStep]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="h-14 text-lg rounded-xl"
              autoFocus
            />
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep ? "w-8 bg-primary" : i < currentStep ? "w-2 bg-success" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            size="lg"
            className="rounded-xl h-14 px-6 glass"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            className="flex-1 rounded-xl h-14 text-lg"
          >
            {currentStep === questions.length - 1 ? "Start Your Journey" : "Next"}
            {currentStep < questions.length - 1 && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPersonality;
