"use client"

import { useCreateApiKey } from "@/features/ory-admin/hooks/useApiKeysQuery"
import { useDialogStore } from "@/store/dialogStore"
import { FormDialog } from "@/features/form-builder"
import { createApiKeySchema } from "../schemas"

export default function CreateApiKeyDialog() {
  const { open, closeDialog, openDialog } = useDialogStore()
  const createApiKey = useCreateApiKey()

  return (
    <FormDialog
      open={open}
      onOpenChange={closeDialog}
      schema={createApiKeySchema}
      onSubmit={async (data) => {
        const response = await createApiKey
          .mutateAsync({
            name: data.name,
            actor_id: data.actor_id || undefined,
            scopes: data.scopes?.length ? data.scopes : undefined,
            ttl: data.ttl || undefined,
          })
          .catch(() => null)

        if (response) {
          closeDialog()
          openDialog("showApiKeySecret", {
            keyId: response.issued_api_key?.key_id,
            secret: response.secret,
          })
        }
      }}
      title="Create API Key"
      description="Issue a new Talos API key."
    />
  )
}
