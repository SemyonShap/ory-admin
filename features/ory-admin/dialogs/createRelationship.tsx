"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useCreateRelationship } from "@/features/ory-admin/hooks/useRelationshipsQuery";
import { useDialogStore } from "@/store/dialogStore";
import { namespaceRelations } from "../utils/relationsConfig";
import { CreateRelationshipBody } from "@ory/client-fetch";
import { FieldHandlers, FormDialog } from "@/features/form-builder";
import { createRelationshipSchema } from "../schemas";
import { useSubjectUsers } from "../hooks/useUsersQuery";
import { useDebounce } from "@/hooks/useDebounce";

export default function CreateRelationshipDialog() {
  const { open, closeDialog } = useDialogStore();
  const createRelationshipMutation = useCreateRelationship();

  const [subjectQuery, setSubjectQuery] = useState("");
  const debouncedQuery = useDebounce(subjectQuery, 400);
  const { data: userSuggestions = [] } = useSubjectUsers(debouncedQuery);

  const handlers: Record<
    string,
    FieldHandlers<typeof createRelationshipSchema>
  > = {
    relation: {
      getOptions: (formValues) => {
        const ns = formValues.namespace;
        return ns
          ? namespaceRelations[ns]?.map((rel) => ({
              value: rel,
              label: rel,
            })) || []
          : [];
      },
    },
    "subject_set.relation": {
      getOptions: (formValues) => {
        const ns = formValues.subject_set?.namespace;
        return ns
          ? namespaceRelations[ns]?.map((rel) => ({
              value: rel,
              label: rel,
            })) || []
          : [];
      },
    },
    subject_id: {
      getOptions: () => userSuggestions,
      onInputChange: setSubjectQuery,
    },
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={closeDialog}
      schema={createRelationshipSchema}
      handlers={handlers}
      title="Create Relationship"
      description="Add a new relationship to Keto."
      onSubmit={async (data) => {
        const body: CreateRelationshipBody = {
          namespace: data.namespace,
          object: data.object,
          relation: data.relation,
        };
        if (data.subjectType === "id") {
          body.subject_id = data.subject_id;
        } else {
          body.subject_set = data.subject_set;
        }
        await createRelationshipMutation.mutateAsync({
          createRelationshipBody: body,
        });
        closeDialog();
        toast.success("Relationship created successfully");
      }}
    />
  );
}
