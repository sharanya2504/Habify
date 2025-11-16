// "use client";

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { APP_TEXT } from "@/data/constants";
// import { useState } from "react";

// export default function CreateGroupModal({ onClose }: { onClose: () => void }) {
//   const [name, setName] = useState("");
//   const [desc, setDesc] = useState("");

//   const handleSubmit = () => {
//     // In future: backend logic here
//     onClose();
//   };

//   return (
//     <Dialog
//       open={true}
//       onOpenChange={onClose}
//     >
//       <DialogContent className="glass rounded-3xl">
//         <DialogHeader>
//           <DialogTitle>{APP_TEXT.social.modals.createGroup.title}</DialogTitle>
//         </DialogHeader>

//         <p className="text-muted-foreground text-sm mb-4">{APP_TEXT.social.modals.createGroup.instruction}</p>

//         <div className="space-y-4">
//           <div>
//             <Label>{APP_TEXT.social.modals.createGroup.nameLabel}</Label>
//             <Input
//               placeholder={APP_TEXT.social.modals.createGroup.namePlaceholder}
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="rounded-xl"
//             />
//           </div>

//           <div>
//             <Label>{APP_TEXT.social.modals.createGroup.descriptionLabel}</Label>
//             <Input
//               placeholder={APP_TEXT.social.modals.createGroup.descPlaceholder}
//               value={desc}
//               onChange={(e) => setDesc(e.target.value)}
//               className="rounded-xl"
//             />
//           </div>

//           <Button
//             onClick={handleSubmit}
//             className="w-full rounded-xl"
//           >
//             {APP_TEXT.social.modals.createGroup.submit}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_TEXT } from "@/data/constants";
import { useState } from "react";

export default function CreateGroupModal({
  onClose,
  onGroupCreated,
}: {
  onClose: () => void;
  onGroupCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  // userId stored as RAW string, NOT JSON
  const userId = localStorage.getItem("userId");

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Group name is required!");

    if (!userId) {
      console.error("❌ userId missing from localStorage");
      return alert("User not logged in!");
    }

    const payload = {
      name: name.trim(),
      description: desc.trim(),
      createdBy: "6919473e31805281f7308140",                   // ⭐ FIX: send raw ObjectID string
      members: [
        {
          user: userId,                    // ⭐ auto-add creator as member
          role: "admin",
        },
      ],
    };

    console.log("🔥 Sending group payload:", payload);

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/groups/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      // Refresh parent list
      onGroupCreated();
      onClose();
    } catch (err) {
      console.error("❌ Error creating group:", err);
      alert("Failed to create group. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="glass rounded-3xl">
        <DialogHeader>
          <DialogTitle>{APP_TEXT.social.modals.createGroup.title}</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground text-sm mb-4">
          {APP_TEXT.social.modals.createGroup.instruction}
        </p>

        <div className="space-y-4">
          <div>
            <Label>Group Name</Label>
            <Input
              className="rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              className="rounded-xl"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full rounded-xl"
          >
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
