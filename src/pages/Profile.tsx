import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { LogOut, Edit, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";
import penguinBlue from "@/assets/penguin-blue.png";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <TopNav />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="glass rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 gradient-primary opacity-10 blur-3xl rounded-full" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <img 
              src={penguinBlue} 
              alt="Waddles"
              className="w-32 h-32 rounded-3xl"
            />
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Sarah M.</h1>
              <p className="text-lg text-muted-foreground mb-4">
                Penguin companion: Waddles 💙
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="glass rounded-xl px-4 py-2">
                  <p className="text-sm text-muted-foreground">Total Gems</p>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    <Gem className="w-5 h-5 text-gem fill-gem" />
                    248
                  </p>
                </div>
                
                <div className="glass rounded-xl px-4 py-2">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    🔥 12 days
                  </p>
                </div>
                
                <div className="glass rounded-xl px-4 py-2">
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="rounded-xl glass">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Edit Pet Section */}
        <div className="glass rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Customize Your Penguin</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Penguin Color</h3>
              <div className="flex gap-3">
                {["bg-secondary", "bg-accent", "bg-warning", "bg-primary"].map((color, i) => (
                  <button
                    key={i}
                    className={`w-12 h-12 rounded-xl ${color} ${i === 0 ? "ring-4 ring-foreground" : ""} hover:scale-110 transition-transform`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Penguin Name</h3>
              <p className="text-lg">Waddles</p>
              <Button variant="outline" size="sm" className="mt-2 rounded-xl">
                Change Name
              </Button>
            </div>
          </div>
        </div>

        {/* Streak Calendar */}
        <div className="glass rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Streak Calendar</h2>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }, (_, i) => {
              const isComplete = i < 20;
              const isPerfect = i < 12;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    isComplete 
                      ? isPerfect 
                        ? "bg-success text-white" 
                        : "bg-primary/30" 
                      : "bg-muted"
                  }`}
                >
                  {isPerfect && "😊"}
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success" />
              <span className="text-muted-foreground">Perfect Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/30" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-muted-foreground">Missed</span>
            </div>
          </div>
        </div>

        {/* Gem Earnings */}
        <div className="glass rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Gem History</h2>
          
          <div className="space-y-4">
            {[
              { action: "Completed Morning Meditation", gems: 10, time: "2 hours ago" },
              { action: "Quest: Consistency Champion", gems: 50, time: "Yesterday" },
              { action: "Completed all daily tasks", gems: 25, time: "2 days ago" },
              { action: "7-day streak bonus", gems: 100, time: "3 days ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
                <div className="flex items-center gap-2 text-gem font-bold">
                  <Gem className="w-5 h-5 fill-gem" />
                  +{item.gems}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <Button 
          variant="destructive" 
          className="w-full rounded-xl h-12"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
