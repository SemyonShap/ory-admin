"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDialogStore } from "@/store/dialogStore"
import { useEffect } from "react"
import { toast } from "sonner"
import { useApiKey } from "@/features/ory-admin/hooks"
import { InfoFields, buildInfoFields } from "@/components/common/infoFields"
import CopyToClipboard from "@/components/common/copyToClipboard"

export default function ShowApiKeyInfoDialog() {
  const { open, props, closeDialog } = useDialogStore()
  const keyId = (props?.keyId as string) || ""

  const { data: key, isLoading, error } = useApiKey(keyId)

  useEffect(() => {
    if (error || (!key && !isLoading)) {
      toast.error("Error loading API key information")
      closeDialog()
    }
  }, [error, key, isLoading, closeDialog])

  const fields = buildInfoFields(key, [
    "name",
    "key_id",
    "actor_id",
    "scopes",
    "status",
    "create_time",
    "expire_time",
    "last_used_time",
    "metadata",
  ])

  const infoText = fields
    .map((field) => `${field.label}: ${field.value || "N/A"}`)
    .join("\n")

  return (
    <Dialog key={keyId} open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="flex flex-row justify-between items-start">
          <div>
            <DialogTitle className="uppercase font-black">
              API Key Info
            </DialogTitle>
            <DialogDescription>{keyId}</DialogDescription>
          </div>
          <CopyToClipboard text={infoText} />
        </DialogHeader>
        <InfoFields fields={fields} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
