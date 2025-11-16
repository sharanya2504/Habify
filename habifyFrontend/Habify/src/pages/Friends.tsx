// src/pages/Friends.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

import AddFriendModal from "@/components/social/add-friend-modal";
import CreateGroupModal from "@/components/social/create-group-modal";
import GroupDetailsModal from "@/components/social/group-details-modal";

import { APP_TEXT } from "@/data/constants";
import { TOKENS } from "@/data/constants";

interface Friend {
  _id: string;
  name: string;
  phone: string;
  petName: string;
  totalDiamonds: number;
  totalDailyStreak: number;
  createdAt: string;
}

interface Group {
  _id: string;
  name: string;
  description: string;
  avatar: string;
  createdBy: string;
  members: any[];
  totalPoints: number;
  createdAt: string;
}

const Friends = () => {
  const [tab, setTab] = useState<"friends" | "groups">("friends");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { profile } = useApp();
  const userId = localStorage.getItem("userId");

  // Fetch friends and groups
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        
        // Fetch friends
        const friendsResponse = await fetch(`http://localhost:3000/api/friends/${userId}`);
        if (friendsResponse.ok) {
          const friendsData = await friendsResponse.json();
          setFriends(friendsData.friends || []);
        }

        // Fetch groups
        const groupsResponse = await fetch(`http://localhost:3000/api/groups/user/${userId}`);
        if (groupsResponse.ok) {
          const groupsData = await groupsResponse.json();
          setGroups(groupsData.groups || []);
        }

      } catch (err) {
        console.error('Error fetching social data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/friends/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, friendId })
      });

      if (response.ok) {
        setFriends(prev => prev.filter(f => f._id !== friendId));
      }
    } catch (err) {
      console.error('Error removing friend:', err);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    // Implement leave group logic
    setGroups(prev => prev.filter(g => g._id !== groupId));
  };

  const refreshFriends = async () => {
    if (!userId) return;
    
    const response = await fetch(`http://localhost:3000/api/friends/${userId}`);
    if (response.ok) {
      const data = await response.json();
      setFriends(data.friends || []);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-8">
        <TopNav />
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
              {APP_TEXT.social.pageTitle}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              {APP_TEXT.social.pageSubtitle}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("friends")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              tab === "friends" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {APP_TEXT.social.tabs.friends} ({friends.length})
          </button>

          <button
            onClick={() => setTab("groups")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              tab === "groups" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {APP_TEXT.social.tabs.groups} ({groups.length})
          </button>
        </div>

        {/* FRIENDS TAB */}
        {tab === "friends" && (
          <div className="space-y-6">
            {/* Add Friend Button */}
            <Button
              onClick={() => setShowAddFriend(true)}
              className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl"
            >
              {APP_TEXT.social.addFriendButton}
            </Button>

            {/* Shareable Link */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {APP_TEXT.social.inviteLabel}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`pethabit.app/invite/${profile?.phone || 'user'}`}
                  readOnly
                  className="flex-1 px-4 py-2 bg-muted rounded-lg text-sm"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText(`pethabit.app/invite/${profile?.phone || 'user'}`)}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                >
                  {APP_TEXT.social.copyButton}
                </button>
              </div>
            </div>

            {/* Friend List */}
            <div className="space-y-4">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="glass rounded-2xl p-4 md:p-6 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Avatar */}
                      <div className="relative self-center sm:self-start">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                          {friend.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-success flex items-center justify-center text-white text-xs font-bold border-4 border-background">
                          ✓
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg md:text-xl font-bold mb-1">
                          {friend.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {APP_TEXT.social.friendLabels.petLabel}: {friend.petName}
                        </p>
                        <div className="flex justify-center sm:justify-start items-center gap-4 text-sm">
                          <span className="flex items-center space-x-1">
                            <span>{TOKENS.emojis.fire}</span>
                            <span className="font-medium">
                              {friend.totalDailyStreak} {APP_TEXT.social.friendLabels.streakLabel}
                            </span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>{TOKENS.emojis.gem}</span>
                            <span className="font-medium">
                              {friend.totalDiamonds} {APP_TEXT.social.friendLabels.gemsLabel}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 justify-center sm:block">
                        <Button
                          variant="destructive"
                          className="rounded-xl w-full sm:w-auto"
                          onClick={() => handleRemoveFriend(friend._id)}
                        >
                          {APP_TEXT.buttons.removeFriend}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-card rounded-2xl">
                  <p className="text-muted-foreground text-lg">
                    {APP_TEXT.social.emptyFriends.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {APP_TEXT.social.emptyFriends.subtitle}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GROUPS TAB */}
        {tab === "groups" && (
          <div className="space-y-6">
            <Button
              onClick={() => setShowCreateGroup(true)}
              className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl"
            >
              {APP_TEXT.social.createGroupButton}
            </Button>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="glass rounded-2xl p-6 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{group.avatar}</div>
                    <div>
                      <h3 className="font-bold text-lg">{group.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm mt-2 mb-4">
                    <span>
                      {group.members.length} {APP_TEXT.social.groupLabels.members}
                    </span>
                    <span>
                      {group.totalPoints} {APP_TEXT.social.groupLabels.totalPoints}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl w-full"
                      onClick={() => setSelectedGroup(group)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      className="rounded-xl w-full"
                      onClick={() => handleLeaveGroup(group._id)}
                    >
                      {APP_TEXT.buttons.leaveGroup}
                    </Button>
                  </div>
                </div>
              ))}

              {groups.length === 0 && (
                <div className="col-span-2 text-center py-12 bg-card rounded-2xl">
                  <p className="text-muted-foreground text-lg">
                    No groups yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create your first group to start building habits together!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddFriend && (
        <AddFriendModal 
          onClose={() => setShowAddFriend(false)} 
          onFriendAdded={refreshFriends}
        />
      )}

      {showCreateGroup && (
        <CreateGroupModal 
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={() => window.location.reload()}
        />
      )}

      {selectedGroup && (
        <GroupDetailsModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default Friends;