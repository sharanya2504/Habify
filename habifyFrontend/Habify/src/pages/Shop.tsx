import React from "react";
import { Button } from "@/components/ui/button";
import { Gem } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";

// Import item images
import hatImg from "@/assets/shop/hat.jpeg";
import streakFreezeImg from "@/assets/shop/streak-freeze.jpeg";
import streakReviveImg from "@/assets/shop/streak-revive.jpeg";
import goldenBadgeImg from "@/assets/shop/golden-badge.avif";

export default function Shop() {
  const { profile, updateProfile } = useApp();
  const navigate = useNavigate();

  if (!profile) return null;

  const items = [
    {
      id: 1,
      name: "Streak Freeze ❄️",
      desc: "Protect your streak for 1 missed day",
      price: 30,
      image: streakFreezeImg,
    },
    {
      id: 2,
      name: "Streak Revive ❤️",
      desc: "Revive a broken streak once",
      price: 50,
      image: streakReviveImg,
    },
    {
      id: 3,
      name: "Golden Badge ⭐",
      desc: "Show off a shiny badge on your profile",
      price: 40,
      image: goldenBadgeImg,
    },
    {
      id: 4,
      name: "Cute Hat 🎩",
      desc: "A stylish hat for your penguin!",
      price: 25,
      image: hatImg,
    },
  ];

  const buyItem = (item: any) => {
    if (profile.totalGems < item.price) {
      alert("Not enough gems!");
      return;
    }

    updateProfile({
      totalGems: profile.totalGems - item.price,
    });

    alert(`You bought ${item.name}!`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-10">
      {/* HEADER */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">🛒 Shop</h1>
        <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl">
          Back
        </Button>
      </div>

      {/* BALANCE */}
      <div className="glass mx-6 p-4 rounded-3xl flex items-center gap-3 text-lg mb-6">
        <Gem className="text-gem fill-gem" />
        <span className="font-bold">{profile.totalGems} Gems</span>
      </div>

      {/* ITEMS */}
      <div className="px-6 space-y-6 pb-20">
        {items.map((item) => (
          <div key={item.id} className="glass p-4 rounded-3xl flex gap-4 items-center hover:bg-muted/20 transition">
            {/* ITEM IMAGE */}
            <img
              src={item.image}
              className="w-24 h-24 rounded-2xl shadow-md object-cover"
              alt={item.name}
            />

            {/* DETAILS */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-sm text-muted-foreground">{item.desc}</p>

              <div className="flex items-center gap-2 mt-2 font-bold text-gem">
                <Gem className="w-4 h-4 fill-gem" /> {item.price}
              </div>
            </div>

            {/* BUY BUTTON */}
            <Button className="rounded-xl px-5" onClick={() => buyItem(item)}>
              Buy
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
