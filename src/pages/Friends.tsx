"use client";

import { useState } from "react";
import { getStoredFriends, storeFriends } from "@/lib/storage";

import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import AddFriendModal from "@/components/social/add-friend-modal";
import CreateGroupModal from "@/components/social/create-group-modal";
import GroupDetailsModal from "@/components/social/group-details-modal";

import { APP_TEXT } from "@/data/constants";
import { TOKENS } from "@/data/constants";
import { mockFriends, mockGroups } from "@/data/mockData";

const Friends = () => {
  const [tab, setTab] = useState<"friends" | "groups">("friends");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const [friends, setFriends] = useState<any[]>(() => {
    const stored = getStoredFriends();
    return stored ?? [...mockFriends];
  });

  const navigate = useNavigate();

  const [groups, setGroups] = useState([...mockGroups]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleRemoveFriend = (friendId: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  const handleLeaveGroup = (groupId: number) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <TopNav />

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">{APP_TEXT.social.pageTitle}</h1>
            <p className="text-base md:text-lg text-muted-foreground">{APP_TEXT.social.pageSubtitle}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("friends")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              tab === "friends" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {APP_TEXT.social.tabs.friends} ({friends.length})
          </button>

          <button
            onClick={() => setTab("groups")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              tab === "groups" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"
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
              <p className="text-sm font-medium text-muted-foreground mb-2">{APP_TEXT.social.inviteLabel}</p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value="pethabit.app/invite/user123"
                  readOnly
                  className="flex-1 px-4 py-2 bg-muted rounded-lg text-sm"
                />
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors">
                  {APP_TEXT.social.copyButton}
                </button>
              </div>
            </div>

            {/* Friend List */}
            <div className="space-y-4">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="glass rounded-2xl p-4 md:p-6 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Avatar */}
                      <div className="relative self-center sm:self-start">
                        <img
                          src={friend.avatar}
                          alt=""
                          className="w-20 h-20 md:w-24 md:h-24 rounded-2xl"
                        />
                        <div
                          className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 
                                        rounded-full bg-success flex items-center justify-center
                                        text-white text-xs font-bold border-4 border-background"
                        >
                          ✓
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg md:text-xl font-bold mb-1">{friend.name}</h3>

                        <p className="text-sm text-muted-foreground mb-2">
                          {APP_TEXT.social.friendLabels.petLabel}: {friend.penguinName}
                        </p>

                        <div className="flex justify-center sm:justify-start items-center gap-4 text-sm">
                          <span className="flex items-center space-x-1">
                            <span>{TOKENS.emojis.fire}</span>
                            <span className="font-medium">
                              {friend.streak} {APP_TEXT.social.friendLabels.streakLabel}
                            </span>
                          </span>

                          <span className="flex items-center space-x-1">
                            <span>{TOKENS.emojis.gem}</span>
                            <span className="font-medium">
                              {friend.gems} {APP_TEXT.social.friendLabels.gemsLabel}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 justify-center sm:block">
                        <Button
                          variant="destructive"
                          className="rounded-xl w-full sm:w-auto"
                          onClick={() => handleRemoveFriend(friend.id)}
                        >
                          {APP_TEXT.buttons.removeFriend}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-card rounded-2xl">
                  <p className="text-muted-foreground text-lg">{APP_TEXT.social.emptyFriends.title}</p>
                  <p className="text-sm text-muted-foreground mt-2">{APP_TEXT.social.emptyFriends.subtitle}</p>
                </div>
              )}
            </div>

            {/* Traveling Together */}
            <div className="glass rounded-2xl p-6 mt-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-3">{APP_TEXT.social.travelingTitle}</h3>

              <p className="text-sm md:text-base text-muted-foreground mb-5">{APP_TEXT.social.travelingText}</p>

              <div className="flex justify-center items-center gap-3 md:gap-4">
                {friends.slice(0, 3).map((friend, idx) => (
                  <img
                    key={friend.id}
                    src={friend.avatar}
                    alt=""
                    className="w-16 h-16 md:w-20 md:h-20 animate-bounce-slow"
                    style={{ animationDelay: `${(idx + 1) * 0.2}s` }}
                  />
                ))}
              </div>
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
                  key={group.id}
                  className="glass rounded-2xl p-6 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{group.avatar}</div>

                    <div>
                      <h3 className="font-bold text-lg">{group.name}</h3>
                      <p className="text-muted-foreground text-sm">{group.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm mt-2 mb-4">
                    <span>
                      {group.members} {APP_TEXT.social.groupLabels.members}
                    </span>
                    <span>
                      {group.totalPoints} {APP_TEXT.social.groupLabels.totalPoints}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl w-full"
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      View Details
                    </Button>

                    <Button
                      variant="destructive"
                      className="rounded-xl w-full"
                      onClick={() => handleLeaveGroup(group.id)}
                    >
                      {APP_TEXT.buttons.leaveGroup}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddFriend && <AddFriendModal onClose={() => setShowAddFriend(false)} />}

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}

      <BottomNav />
      {selectedGroup && (
        <GroupDetailsModal
          group={selectedGroup}
          friends={friends}
          setFriends={setFriends}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
};

export default Friends;