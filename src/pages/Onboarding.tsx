import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mascot } from '@/components/Mascot';
import { useApp } from '@/contexts/AppContext';
import { ChevronRight } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { setProfile } = useApp();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState('');
  const [petName, setPetName] = useState('');
  const [mascot] = useState<'penguin'>('penguin');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('22:00');
  const [sleepDuration, setSleepDuration] = useState('');

  const handleComplete = () => {
    const newProfile = {
      id: '1',
      phone,
      username,
      petName,
      mascot,
      level: 1,
      xp: 0,
      totalGems: 0,
      wakeTime,
      sleepTime,
      createdAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    navigate('/streak-intro');
  };

  const steps = [

  // 0 — WELCOME
  {
    title: 'Welcome to Habify! 💜',
    content: (
      <div className="space-y-6 text-center">
        <Mascot mood="happy" size="lg" className="mx-auto" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Build better habits together</h2>
          <p className="text-muted-foreground">
            Your cute companion will grow with you as you build healthy daily habits
          </p>
        </div>

        <Button 
          onClick={() => setStep(1)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg w-full"
        >
          Let's Start <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    ),
  },

  // 1 — PHONE NUMBER
  {
    title: "Enter your phone number 📱",
    content: (
      <div className="space-y-6 text-center">
        <Input
          type="tel"
          maxLength={10}
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          className="text-center text-lg py-6 rounded-full border-2"
        />

        <Button 
          onClick={() => setStep(2)}
          disabled={phone.length !== 10}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg w-full disabled:opacity-50"
        >
          Continue ➜
        </Button>
      </div>
    )
  },

  // 2 — NAME
  {
    title: "What's your name?",
    content: (
      <div className="space-y-6">
        <Mascot mood="idle" size="md" className="mx-auto" />

        <Input
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="text-center text-lg py-6 rounded-full border-2"
        />

        <Button 
          onClick={() => setStep(3)}
          disabled={!username}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg w-full disabled:opacity-50"
        >
          Continue <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    ),
  },

  // 3 — PET NAME
  {
    title: "What's your pet's name?",
    content: (
      <div className="space-y-6">
        <Mascot mood="happy" size="md" className="mx-auto" />

        <Input
          placeholder="Give your pet a cute name"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          className="text-center text-lg py-6 rounded-full border-2"
        />

        <Button 
          onClick={() => setStep(4)}
          disabled={!petName}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg w-full disabled:opacity-50"
        >
          Continue <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    ),
  },

  // 4 — SLEEP DURATION
  {
    title: "How many hours do you sleep?",
    content: (
      <div className="space-y-6 text-center">
        <Mascot mood="sleepy" size="md" className="mx-auto" />

        <p className="text-muted-foreground">
          Choose the option that matches your usual sleep duration
        </p>

        <div className="grid grid-cols-2 gap-4">
          {[
            {label: "Less than 5 hrs", emoji: "😵", value: "<5"},
            {label: "5 - 7 hrs", emoji: "😴", value: "5-7"},
            {label: "7 - 9 hrs", emoji: "😊", value: "7-9"},
            {label: "More than 9 hrs", emoji: "😴💤", value: ">9"},
          ].map((opt) => (
            <Card
              key={opt.value}
              onClick={() => setSleepDuration(opt.value)}
              className={`p-4 cursor-pointer transition-all duration-300 rounded-xl hover:scale-105 ${
                sleepDuration === opt.value ?
                "ring-2 ring-primary shadow-lg bg-primary/10" : "opacity-70"
              }`}
            >
              <div className="text-3xl">{opt.emoji}</div>
              <p className="text-sm font-medium mt-2">{opt.label}</p>
            </Card>
          ))}
        </div>

        <Button
          onClick={() => setStep(5)}
          disabled={!sleepDuration}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg w-full disabled:opacity-50"
        >
          Continue <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    ),
  },

  // 5 — SCHEDULE
  {
    title: 'Set Your Schedule',
    content: (
      <div className="space-y-6">
        <p className="text-center text-muted-foreground">Help me remind you at the right times</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Wake Time</label>
            <Input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="text-center py-6 rounded-full border-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Sleep Time</label>
            <Input
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="text-center py-6 rounded-full border-2"
            />
          </div>
        </div>

        <Button 
          onClick={() => setStep(6)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg w-full"
        >
          Continue <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    ),
  },

  // 6 — PROMISE (FINAL)
  {
    title: "A Little Promise 💖",
    content: (
      <div className="space-y-6 text-center">
        <Mascot mood="celebrate" size="md" className="mx-auto" />

        <p className="text-lg font-medium text-foreground">
          {username} & {petName}
        </p>

        <Card className="p-6 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg space-y-4">
          <p className="text-sm text-foreground/90 leading-relaxed">
            🌟 <strong>{petName}</strong> promises to stay by your side,
            cheer for you, and celebrate every tiny win.
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            💜 And <strong>{username}</strong> promises to take small steps,
            show up with kindness, and grow a little every day.
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Together, we’ll build habits that make life brighter — one day at a time. ✨
          </p>
        </Card>

        <Button
          onClick={handleComplete}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg w-full"
        >
          Start My Journey! 🎉
        </Button>
      </div>
    ),
  },

];


  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender via-sky to-mint p-6 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 space-y-6 glass-effect">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-foreground">{steps[step].title}</h1>
        </div>
        {steps[step].content}
      </Card>
    </div>
  );
}


