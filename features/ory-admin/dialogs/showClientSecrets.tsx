"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDialogStore } from "@/store/dialogStore";
import CopyToClipboard from "@/components/custom/copyToClipboard";

export default function ShowClientSecretsDialog() {
  const { open, props, closeDialog } = useDialogStore();
  const clientId = (props?.clientId as string) || "";
  const clientSecret = (props?.clientSecret as string) || "";

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Client Created Successfully</DialogTitle>
          <DialogDescription>
            Save these credentials securely. The client secret will not be shown
            again.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-id">Client ID</Label>
            <div className="flex space-x-2">
              <Input
                id="client-id"
                value={clientId}
                readOnly
                className="flex-1"
              />
              <CopyToClipboard text={clientId} label="Client ID" />
            </div>
          </div>
          {clientSecret && (
            <div className="space-y-2">
              <Label htmlFor="client-secret">Client Secret</Label>
              <div className="flex space-x-2">
                <Input
                  id="client-secret"
                  value={clientSecret}
                  readOnly
                  type="password"
                  className="flex-1"
                />
                <CopyToClipboard text={clientSecret} label="Client Secret" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
