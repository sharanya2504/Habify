//src/components/social/add-friend-modal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_TEXT } from "@/data/constants";
import { useState } from "react";

export default function AddFriendModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    // In future: backend logic here
    onClose();
  };

  return (
    <Dialog
      open={true}
      onOpenChange={onClose}
    >
      <DialogContent className="glass rounded-3xl">
        <DialogHeader>
          <DialogTitle>{APP_TEXT.social.modals.addFriend.title}</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground text-sm mb-4">{APP_TEXT.social.modals.addFriend.instruction}</p>

        <Input
          placeholder={APP_TEXT.social.modals.addFriend.placeholder}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="rounded-xl"
        />

        <Button
          onClick={handleSubmit}
          className="w-full rounded-xl mt-4"
        >
          {APP_TEXT.social.modals.addFriend.submit}
        </Button>
      </DialogContent>
    </Dialog>
  );
}