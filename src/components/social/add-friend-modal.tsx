"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_TEXT } from "@/data/constants";
import { useState } from "react";

export default function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

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
          <DialogTitle>{APP_TEXT.social.modals.createGroup.title}</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground text-sm mb-4">{APP_TEXT.social.modals.createGroup.instruction}</p>

        <div className="space-y-4">
          <div>
            <Label>{APP_TEXT.social.modals.createGroup.nameLabel}</Label>
            <Input
              placeholder={APP_TEXT.social.modals.createGroup.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div>
            <Label>{APP_TEXT.social.modals.createGroup.descriptionLabel}</Label>
            <Input
              placeholder={APP_TEXT.social.modals.createGroup.descPlaceholder}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full rounded-xl"
          >
            {APP_TEXT.social.modals.createGroup.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}