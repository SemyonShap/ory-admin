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
import { Spinner } from "@/components/ui/spinner"
import { useRevokeApiKey } from "@/features/ory-admin/hooks"
import { useDialogStore } from "@/store/dialogStore"

export default function RevokeApiKeyDialog() {
  const { open, closeDialog, props } = useDialogStore()
  const revokeMutation = useRevokeApiKey()

  const keyId = props?.keyId as string | undefined

  if (!keyId) return null

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke API Key</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke this API key? This action cannot be
            undone.
            <br />
            <span className="font-bold">{keyId}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => closeDialog()}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              revokeMutation.mutate(keyId, {
                onSuccess: () => closeDialog(),
              })
            }
            disabled={revokeMutation.isPending}
          >
            {revokeMutation.isPending ? <Spinner /> : "Revoke"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
