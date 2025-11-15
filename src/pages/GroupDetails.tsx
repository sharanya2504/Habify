// src/pages/GroupDetails.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TopNav } from "@/components/ui/top-nav";
import { Button } from "@/components/ui/button";
import { APP_TEXT, TOKENS } from "@/data/constants";
import { mockGroups } from "@/data/mockData";
import { loadFriends, addFriendToStorage, removeFriendFromStorage } from "@/lib/storage";
import penguinBlue from "@/assets/penguin-blue.png";

/**
 * GroupDetails page
 * - Metrics: Max streak, Average streak, Group completion rate (D),
 *   Leaderboard top 3 (F), Total members + Growth (G)
 * - Member list shows full friend-like info and Add Friend button (adds to stored friends)
 * - Navigated to from Friends.tsx via /groups/:id
 */

export default function GroupDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const groupId = params.id ? Number(params.id) : null;

  const [group, setGroup] = useState<any | null>(null);
  const [friends, setFriends] = useState<any[]>(() => loadFriends());
  const [addedIds, setAddedIds] = useState<Set<number>>(() => new Set(friends.map((f) => f.id)));

  // load group on mount
  useEffect(() => {
    if (groupId == null) return;
    const g = mockGroups.find((x) => x.id === groupId) ?? null;
    setGroup(g);
  }, [groupId]);

  // recompute addedIds when friends change
  useEffect(() => {
    setAddedIds(new Set(friends.map((f) => f.id)));
  }, [friends]);

  // helpers: metrics
  const metrics = useMemo(() => {
    if (!group) return null;

    const members = group.membersList ?? [];

    // A - Max streak (member with highest streak)
    let maxStreakMember = null;
    let maxStreak = -1;
    members.forEach((m: any) => {
      if ((m.streak ?? 0) > maxStreak) {
        maxStreak = m.streak ?? 0;
        maxStreakMember = m;
      }
    });

    // B - Average streak
    const avgStreak =
      members.length === 0 ? 0 : Math.round((members.reduce((s: number, m: any) => s + (m.streak ?? 0), 0) / members.length) * 10) / 10;

    // D - Group completion rate (dailyProgress average)
    const completionRate =
      members.length === 0 ? 0 : Math.round(members.reduce((s: number, m: any) => s + (m.dailyProgress ?? 0), 0) / members.length);

    // F - Leaderboard top 3 (by streak, fallback to gems)
    const leaderboard = [...members]
      .sort((a: any, b: any) => {
        if ((b.streak ?? 0) !== (a.streak ?? 0)) return (b.streak ?? 0) - (a.streak ?? 0);
        return (b.gems ?? 0) - (a.gems ?? 0);
      })
      .slice(0, 3);

    // G - total members and growth (fake growth relative to createdDate or weeklyActivity diff)
    const totalMembers = members.length;
    // growth = change between last two days in weeklyActivity (if exists)
    let growth = 0;
    if (Array.isArray(group.weeklyActivity) && group.weeklyActivity.length >= 2) {
      const arr = group.weeklyActivity;
      growth = arr[arr.length - 1].value - arr[arr.length - 2].value;
    }

    return {
      maxStreakMember,
      maxStreak,
      avgStreak,
      completionRate,
      leaderboard,
      totalMembers,
      growth,
    };
  }, [group]);

  // Add friend handler (immediately store)
  const handleAddFriend = (member: any) => {
    const existing = friends.find((f) => f.id === member.id);
    if (existing) return;
    // create friend object shaped like mockFriends
    const newFriend = {
      id: member.id,
      name: member.name,
      petName: member.petName,
      petSpecies: member.petSpecies ?? "Penguin",
      points: member.gems ?? 0,
      streak: member.streak ?? 0,
      dailyProgress: member.dailyProgress ?? 0,
      avatar: member.avatar ?? penguinBlue,
      addedDate: "Just now",
      gems: member.gems ?? 0,
      // keep other fields if needed
    };
    const next = [...friends, newFriend];
    setFriends(next);
    setAddedIds((s) => new Set(s).add(member.id));
    const updated = addFriendToStorage(newFriend);
    setFriends(updated);
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopNav />
        <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl">
          <p className="text-muted-foreground">{APP_TEXT.groupDetails.notFound}</p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            {APP_TEXT.common.close}
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopNav />
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{group.name}</h1>
            <p className="text-sm text-muted-foreground">{group.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
            >
              {APP_TEXT.common.close}
            </Button>
            <Button onClick={() => navigate("/friends")}>{APP_TEXT.nav.friends}</Button>
          </div>
        </div>

        {/* TOP METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Max streak */}
          <div className="glass p-4 rounded-2xl">
            <p className="text-sm text-muted-foreground">{APP_TEXT.groupDetails.maxStreakTitle}</p>
            <p className="text-xl font-bold mt-2">{metrics?.maxStreak ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">{metrics?.maxStreakMember?.name ?? "-"}</p>
          </div>

          {/* Average streak */}
          <div className="glass p-4 rounded-2xl">
            <p className="text-sm text-muted-foreground">{APP_TEXT.groupDetails.avgStreakTitle}</p>
            <p className="text-xl font-bold mt-2">{metrics?.avgStreak ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">{APP_TEXT.groupDetails.avgStreakSubtitle}</p>
          </div>

          {/* Completion rate (big ring style) */}
          <div className="glass p-4 rounded-2xl">
            <p className="text-sm text-muted-foreground">{APP_TEXT.groupDetails.completionTitle}</p>
            <p className="text-2xl font-bold">{metrics?.completionRate ?? 0}%</p>
            <p className="text-xs text-muted-foreground mt-2">{APP_TEXT.groupDetails.completionSubtitle}</p>
          </div>

          {/* Total members & growth */}
          <div className="glass p-4 rounded-2xl">
            <p className="text-sm text-muted-foreground">{APP_TEXT.groupDetails.membersTitle}</p>
            <p className="text-xl font-bold mt-2">{metrics?.totalMembers ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.growth >= 0 ? "+" : ""}
              {metrics?.growth ?? 0} {APP_TEXT.groupDetails.membersGrowthSuffix}
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass p-4 rounded-2xl">
          <h2 className="text-lg font-bold mb-3">{APP_TEXT.groupDetails.leaderboardTitle}</h2>
          <div className="space-y-3">
            {(metrics?.leaderboard ?? []).map((m: any, idx: number) => (
              <div
                key={m.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* <div className="text-2xl">{m.avatar}</div> */}
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.petName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {m.streak} {TOKENS.emojis.fire}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.gems} {TOKENS.emojis.gem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MEMBERS LIST */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl md:text-2xl font-bold mb-6">{APP_TEXT.groupDetails.membersTitleFull}</h3>

          <div className="space-y-4">
            {(group.membersList ?? []).map((member: any) => {
              const isFriend = addedIds.has(member.id);

              return (
                <div
                  key={member.id}
                  className="glass rounded-2xl p-4 md:p-6 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar */}
                    <div className="relative self-center sm:self-start">
                      <img
                        src={member.avatar}
                        alt=""
                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl"
                      />

                      {isFriend && (
                        <div
                          className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 
                              rounded-full bg-success flex items-center justify-center
                              text-white text-xs font-bold border-4 border-background"
                        >
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg md:text-xl font-bold mb-1">{member.name}</h3>

                      <p className="text-sm text-muted-foreground mb-2">
                        {APP_TEXT.social.friendLabels.petLabel}: {member.petName}
                      </p>

                      <div className="flex justify-center sm:justify-start items-center gap-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <span>{TOKENS.emojis.fire}</span>
                          <span className="font-medium">
                            {member.streak} {APP_TEXT.social.friendLabels.streakLabel}
                          </span>
                        </span>

                        <span className="flex items-center space-x-1">
                          <span>{TOKENS.emojis.gem}</span>
                          <span className="font-medium">
                            {member.gems} {APP_TEXT.social.friendLabels.gemsLabel}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 justify-center sm:block">
                      {isFriend ? (
                        <span className="text-success font-semibold">{APP_TEXT.groupDetails.friendLabel}</span>
                      ) : (
                        <Button
                          size="sm"
                          className="rounded-xl w-full sm:w-auto"
                          onClick={() => handleAddFriend(member)}
                        >
                          {APP_TEXT.groupDetails.addFriendBtn}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
