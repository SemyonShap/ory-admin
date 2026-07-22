import { z } from "zod"
import { formRegistry } from "../../form-builder"
import type { NamespacesWithRelation } from "../types"

function nsEnum(namespaces: string[]) {
  return namespaces.length > 0
    ? z.enum(namespaces)
    : z.string().min(1, "Namespace is required")
}

export function createRelationshipSchema(
  config?: NamespacesWithRelation | null,
) {
  const namespaces = config?.namespaces ?? []
  const namespaceRelations = config?.namespaceRelations ?? {}

  const hasOpl = namespaces.length > 0
  const hasRelations = Object.values(namespaceRelations).some(
    (r) => r.length > 0,
  )

  return z
    .object({
      namespace: nsEnum(namespaces).register(formRegistry, {
        label: "Namespace",
        placeholder: "Select a namespace",
        interface: "select",
      }),
      object: z.string().min(1, "Object is required").register(formRegistry, {
        label: "Object",
        placeholder: "e.g., devs",
      }),
      relation: z
        .string()
        .min(1, "Relation is required")
        .register(formRegistry, {
          label: "Relation",
          placeholder: hasRelations ? "Select a relation" : "Enter relation",
          ...(hasRelations ? { interface: "select" } : {}),
        }),

      subjectType: z.enum(["id", "set"]).default("id").register(formRegistry, {
        label: "Subject Type",
        interface: "radio",
      }),

      subject_id: z
        .string()
        .optional()
        .register(formRegistry, {
          label: "Subject ID",
          placeholder: "Search or enter subject ID",
          interface: "combobox",
          hidden: (values) => values.subjectType !== "id",
        }),

      subject_set: z
        .object({
          namespace: nsEnum(namespaces).register(formRegistry, {
            label: "Subject Set Namespace",
            placeholder: "Select a namespace",
            interface: "select",
          }),
          object: z
            .string()
            .min(1, "Subject Set Object is required")
            .register(formRegistry, {
              label: "Subject Set Object",
              placeholder: "e.g., alice",
            }),
          relation: z
            .string()
            .min(1, "Subject Set Relation is required")
            .register(formRegistry, {
              label: "Subject Set Relation",
              placeholder: hasRelations
                ? "Select a relation"
                : "Enter relation",
              ...(hasRelations ? { interface: "select" } : {}),
            }),
        })
        .register(formRegistry, {
          hidden: (values) => values.subjectType !== "set",
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (!hasOpl) return

      const allowedRelations = namespaceRelations[data.namespace] || []
      if (
        allowedRelations.length > 0 &&
        !allowedRelations.includes(data.relation)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["relation"],
          message: `Invalid relation for namespace "${data.namespace}". Allowed: ${allowedRelations.join(", ")}`,
        })
      }

      if (data.subjectType === "id") {
        if (!data.subject_id || data.subject_id.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["subject_id"],
            message: "Subject ID is required when Subject Type is ID",
          })
        }
      } else if (data.subjectType === "set") {
        if (!data.subject_set) {
          ctx.addIssue({
            code: "custom",
            path: ["subject_set"],
            message: "Subject Set is required when Subject Type is Set",
          })
        } else {
          const subjectSetRelations =
            namespaceRelations[data.subject_set.namespace] || []
          if (
            subjectSetRelations.length > 0 &&
            !subjectSetRelations.includes(data.subject_set.relation)
          ) {
            ctx.addIssue({
              code: "custom",
              path: ["subject_set", "relation"],
              message: `Invalid relation for namespace "${data.subject_set.namespace}". Allowed: ${subjectSetRelations.join(", ")}`,
            })
          }
        }
      }
    })
}
