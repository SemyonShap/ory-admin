"use client"

import { toast } from "sonner"
import { useState, useMemo } from "react"
import {
  useCreateRelationship,
  useNamespaces,
} from "@/features/ory-admin/hooks/useRelationshipsQuery"
import { useDialogStore } from "@/store/dialogStore"
import { CreateRelationshipBody } from "@ory/client-fetch"
import { FormDialog } from "@/features/form-builder"
import { createRelationshipSchema } from "../schemas"
import { useSubjectUsers } from "../hooks/useUsersQuery"
import { useDebounce } from "@/hooks/useDebounce"

export default function CreateRelationshipDialog() {
  const { open, closeDialog } = useDialogStore()
  const createRelationshipMutation = useCreateRelationship()
  const { data: oplConfig } = useNamespaces()

  const [subjectQuery, setSubjectQuery] = useState("")
  const debouncedQuery = useDebounce(subjectQuery, 400)
  const { data: userSuggestions = [] } = useSubjectUsers(debouncedQuery)

  const schema = useMemo(() => createRelationshipSchema(oplConfig), [oplConfig])

  const namespaceRelations = oplConfig?.namespaceRelations ?? {}

  const handlers = {
    relation: {
      getOptions: (formValues: Record<string, unknown>) => {
        const ns = formValues.namespace as string | undefined
        return ns
          ? namespaceRelations[ns]?.map((rel: string) => ({
              value: rel,
              label: rel,
            })) || []
          : []
      },
    },
    "subject_set.relation": {
      getOptions: (formValues: Record<string, unknown>) => {
        const subjectSet = formValues.subject_set as
          | Record<string, unknown>
          | undefined
        const ns = subjectSet?.namespace as string | undefined
        return ns
          ? namespaceRelations[ns]?.map((rel: string) => ({
              value: rel,
              label: rel,
            })) || []
          : []
      },
    },
    subject_id: {
      getOptions: () => userSuggestions,
      onInputChange: setSubjectQuery,
    },
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={closeDialog}
      schema={schema}
      handlers={handlers}
      title="Create Relationship"
      description="Add a new relationship to Keto."
      onSubmit={async (data) => {
        const body: CreateRelationshipBody = {
          namespace: data.namespace,
          object: data.object,
          relation: data.relation,
        }
        if (data.subjectType === "id") {
          body.subject_id = data.subject_id
        } else {
          body.subject_set = data.subject_set
        }
        await createRelationshipMutation.mutateAsync({
          createRelationshipBody: body,
        })
        closeDialog()
        toast.success("Relationship created successfully")
      }}
    />
  )
}
