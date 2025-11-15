"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { APP_TEXT } from "@/data/constants";
import { TOKENS } from "@/data/constants";
import { mockFriends } from "@/data/mockData";

interface GroupDetailsModalProps {
  group: any;
  onClose: () => void;
  friends: any[];
  setFriends: (fn: any) => void;
}

export default function GroupDetailsModal({ group, onClose, friends, setFriends }: GroupDetailsModalProps) {
  if (!group) return null;

  const handleAddFriend = (member: any) => {
    const alreadyFriend = friends.some((f) => f.id === member.id);
    if (alreadyFriend) return;

    const newFriend = {
      id: member.id,
      name: member.name,
      petName: member.petName,
      avatar: member.avatar,
      gems: member.gems ?? 0,
      streak: member.streak ?? 0,
    };

    setFriends((prev: any[]) => [...prev, newFriend]);
  };

  return (
    <Dialog
      open={true}
      onOpenChange={onClose}
    >
      <DialogContent className="glass rounded-3xl max-w-lg">
        <DialogHeader>
          <DialogTitle>{group.name}</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground text-sm mb-2">{group.description}</p>

        <div className="flex justify-between text-sm mb-4">
          <span>
            {group.members} {APP_TEXT.social.groupLabels.members}
          </span>
          <span>
            {group.totalPoints} {APP_TEXT.social.groupLabels.totalPoints}
          </span>
        </div>

        <h3 className="font-bold text-lg mb-3">Members</h3>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {group.membersList.map((member: any) => {
            const isFriend = friends.some((f) => f.id === member.id);

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt=""
                    className="w-12 h-12 rounded-xl"
                  />
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.petName}</p>
                  </div>
                </div>

                {isFriend ? (
                  <span className="text-success font-semibold">Friends ✓</span>
                ) : (
                  <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={() => handleAddFriend(member)}
                  >
                    Add Friend
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
