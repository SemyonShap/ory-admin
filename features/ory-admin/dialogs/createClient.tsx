"use client";

import { useCreateClient } from "@/features/ory-admin/hooks/useClientsQuery";
import { useDialogStore } from "@/store/dialogStore";
import { FormDialog } from "@/features/form-builder";
import { createClientSchema } from "../schemas";

export default function CreateClientDialog() {
  const { open, closeDialog, openDialog } = useDialogStore();
  const createClient = useCreateClient();

  return (
    <FormDialog
      open={open}
      onOpenChange={closeDialog}
      schema={createClientSchema}
      onSubmit={async (data) => {
        const response = await createClient.mutateAsync({
          oAuth2Client: {
            ...data,
            scope: data.scope?.join(" ") || "",
          },
        });

        if (response) {
          closeDialog();
          openDialog("showClient", {
            clientId: response.client_id,
            clientSecret: response.client_secret,
          });
        }
      }}
      title="Create OAuth2 Client"
      description="Add a new OAuth2 client to your application."
    />
  );
}
