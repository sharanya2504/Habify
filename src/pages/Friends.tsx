import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { UserPlus } from "lucide-react";
import penguinBlue from "@/assets/penguin-blue.png";
import penguinPink from "@/assets/penguin-pink.png";
import penguinYellow from "@/assets/penguin-yellow.png";

const friends = [
  {
    id: 1,
    name: "Alex",
    penguinName: "Pippin",
    avatar: penguinBlue,
    streak: 12,
    gems: 342,
  },
  {
    id: 2,
    name: "Sam",
    penguinName: "Flurry",
    avatar: penguinPink,
    streak: 8,
    gems: 215,
  },
  {
    id: 3,
    name: "Jordan",
    penguinName: "Snowball",
    avatar: penguinYellow,
    streak: 15,
    gems: 428,
  },
];

const Friends = () => {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Friends</h1>
            <p className="text-base md:text-lg text-muted-foreground">Stay motivated together!</p>
          </div>

          <Button className="rounded-xl hidden md:flex">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Friend
          </Button>
        </div>

        {/* Friends List */}
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="glass rounded-2xl p-4 md:p-6 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Avatar */}
                <div className="relative self-center sm:self-start">
                  <img
                    src={friend.avatar}
                    alt={friend.penguinName}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-success flex items-center justify-center text-white text-xs font-bold border-4 border-background">
                    ✓
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg md:text-xl font-bold mb-1">{friend.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Penguin: {friend.penguinName}</p>

                  <div className="flex justify-center sm:justify-start items-center gap-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <span>🔥</span>
                      <span className="font-medium">{friend.streak} day streak</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <span>💎</span>
                      <span className="font-medium">{friend.gems} gems</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center sm:block">
                  <Button
                    variant="outline"
                    className="rounded-xl w-full sm:w-auto"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Traveling Together */}
        <div className="glass rounded-2xl p-6 mt-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-3">Traveling Together</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-5">When you and your friends complete tasks, your penguins travel together!</p>

          <div className="flex justify-center items-center gap-3 md:gap-4">
            {friends.slice(0, 3).map((friend) => (
              <img
                key={friend.id}
                src={friend.avatar}
                alt={friend.penguinName}
                className="w-16 h-16 md:w-20 md:h-20 animate-bounce-slow"
                style={{ animationDelay: `${friend.id * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Friends;
