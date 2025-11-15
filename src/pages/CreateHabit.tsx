import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { Habit } from '@/types/habit';

const emojiOptions = ['💪', '📚', '💧', '🧘', '🏃', '🎨', '✍️', '🌱', '☀️', '🌙', '🎯', '💜'];
const colorOptions: Array<'lavender' | 'mint' | 'peach' | 'sky'> = ['lavender', 'mint', 'peach', 'sky'];

export default function CreateHabit() {
  const navigate = useNavigate();
  const { addHabit } = useApp();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💪');
  const [color, setColor] = useState<'lavender' | 'mint' | 'peach' | 'sky'>('lavender');
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const handleCreate = () => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      emoji,
      color,
      frequency: 'daily',
      notificationEnabled,
      isGroupHabit: false,
      createdAt: new Date().toISOString(),
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
    };
    addHabit(newHabit);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender via-sky to-mint p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Create New Habit</h1>
        </div>

        <Card className="p-6 space-y-6 glass-effect">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Habit Name</label>
            <Input
              placeholder="E.g., Morning meditation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py-6 rounded-2xl border-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Choose an Emoji</label>
            <div className="grid grid-cols-6 gap-2">
              {emojiOptions.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-3xl p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                    emoji === e ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted/50'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Choose a Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-16 rounded-xl transition-all duration-300 hover:scale-105 ${
                    color === c ? 'ring-4 ring-foreground' : ''
                  }`}
                  style={{ background: `hsl(var(--${c}))` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <p className="font-medium text-foreground">Daily Reminders</p>
              <p className="text-xs text-muted-foreground">Get notified to complete this habit</p>
            </div>
            <Switch
              checked={notificationEnabled}
              onCheckedChange={setNotificationEnabled}
            />
          </div>

          <Button
            onClick={handleCreate}
            disabled={!name}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-full shadow-lg text-lg disabled:opacity-50"
          >
            Create Habit ✨
          </Button>
        </Card>
      </div>
    </div>
  );
}
