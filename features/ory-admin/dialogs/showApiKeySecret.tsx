"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDialogStore } from "@/store/dialogStore"
import CopyToClipboard from "@/components/common/copyToClipboard"

export default function ShowApiKeySecretDialog() {
  const { open, closeDialog, props } = useDialogStore()
  const secret = (props?.secret as string | undefined) ?? ""

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key Created</DialogTitle>
          <DialogDescription>
            Copy the secret now. It not be shown again.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <code className="break-all bg-muted p-2 rounded-md flex-1">
              {secret || "N/A"}
            </code>
            <CopyToClipboard text={secret} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => closeDialog()}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
