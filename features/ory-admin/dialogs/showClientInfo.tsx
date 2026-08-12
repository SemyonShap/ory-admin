"use client"

import { useEffect } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useDialogStore } from "@/store/dialogStore"
import { useIdentity, useClient } from "@/features/ory-admin/hooks"
import CopyToClipboard from "@/components/common/copyToClipboard"
import { InfoFields, buildInfoFields } from "@/components/common/infoFields"

export default function ShowClientInfoDialog() {
  const { open, props, closeDialog, openDialog } = useDialogStore()
  const clientId = (props?.clientId as string) || ""

  const { data: client, isLoading, error } = useClient(clientId)
  const { data: ownerIdentity } = useIdentity(client?.owner || "")

  useEffect(() => {
    if (error || (!client && !isLoading)) {
      toast.error("Error loading client information")
      closeDialog()
    }
  }, [error, client, isLoading, closeDialog])

  const fields = client
    ? [
        {
          label: "Owner",
          value:
            ownerIdentity?.traits?.username ||
            ownerIdentity?.traits?.email ||
            client.owner ||
            "N/A",
          onClick: () => {
            if (client.owner) {
              openDialog("showUserInfo", { userId: client.owner })
            }
          },
        },
        ...buildInfoFields(client, [
          "client_id",
          "client_name",
          "grant_types",
          "token_endpoint_auth_method",
          "scope",
          "audience",
          "redirect_uris",
          "post_logout_redirect_uris",
          "created_at",
          "updated_at",
        ]),
      ]
    : []

  const infoText = fields
    .map(
      (field) =>
        `${field.label}: ${Array.isArray(field.value) ? field.value.join(", ") : field.value || "N/A"}`,
    )
    .join("\n")

  return (
    <Dialog key={clientId} open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="flex flex-row justify-between items-start">
          <div className="flex flex-col gap-1">
            <DialogTitle className="font-bold uppercase">
              Client Information
            </DialogTitle>
            <DialogDescription>Details for OAuth2 client</DialogDescription>
          </div>
          <CopyToClipboard text={infoText} />
        </DialogHeader>
        <InfoFields fields={fields} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
