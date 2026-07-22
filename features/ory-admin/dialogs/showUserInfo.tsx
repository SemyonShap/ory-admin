"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/store/dialogStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@/features/ory-admin/hooks";
import CopyToClipboard from "@/components/custom/copyToClipboard";
import { InfoFields } from "@/components/custom/infoFields";

export default function ShowUserInfoDialog() {
  const { open, props, closeDialog } = useDialogStore();
  const userId = (props?.userId as string) || "";

  const { data: user, isLoading, error } = useUser({ id: userId });

  useEffect(() => {
    if (error || (!user && !isLoading)) {
      toast.error("Error loading user information");
      closeDialog();
    }
  }, [error, user, isLoading, closeDialog]);

  const fields = user
    ? [
        { label: "ID", value: user.id },
        { label: "Username", value: user.traits?.username },
        { label: "First Name", value: user.traits?.name?.first },
        { label: "Last Name", value: user.traits?.name?.last },
        { label: "Email", value: user.traits?.email },
        {
          label: "Public Metadata",
          value: user.metadata_public
            ? JSON.stringify(user.metadata_public, null, 2)
            : undefined,
        },
        {
          label: "Created At",
          value: user.created_at
            ? new Date(user.created_at).toLocaleString()
            : undefined,
        },
        { label: "State", value: user.state },
      ]
    : [];

  const infoText = fields
    .map((field) => `${field.label}: ${field.value || "N/A"}`)
    .join("\n");

  return (
    <Dialog key={userId} open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="flex flex-row justify-between items-start">
          <div className="flex flex-col gap-1">
            <DialogTitle className="font-bold uppercase">User Information</DialogTitle>
            <DialogDescription>Details for user</DialogDescription>
          </div>
          <CopyToClipboard text={infoText} label="User information" />
        </DialogHeader>
        <InfoFields fields={fields} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
