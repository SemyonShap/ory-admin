import { z } from "zod"
import { formRegistry } from "../../form-builder"

export const createApiKeySchema = z.object({
  name: z.string().min(1).register(formRegistry, {
    label: "Name",
    placeholder: "my-service",
  }),
  actor_id: z.string().min(1).register(formRegistry, {
    label: "Actor ID",
    placeholder: "user_123",
  }),
  scopes: z.array(z.string()).optional().register(formRegistry, {
    label: "Scopes",
    placeholder: "read, write",
    interface: "multiselect",
  }),
  ttl: z.string().optional().register(formRegistry, {
    label: "TTL",
    placeholder: "720h",
  }),
})
