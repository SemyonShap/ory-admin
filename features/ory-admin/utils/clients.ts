import {
  Configuration,
  OAuth2Api,
  IdentityApi,
  RelationshipApi,
  ApiKeysApi,
} from "@ory/client-fetch"
import { requiredServerUrl } from "@/lib/servers"
import { errorMiddleware } from "./errors"

const jsonConfig = (basePath: string) =>
  new Configuration({
    basePath,
    headers: { Accept: "application/json" },
    middleware: [errorMiddleware],
  })

export const identityAdminClient = (server: string) =>
  new IdentityApi(jsonConfig(requiredServerUrl(server, "kratos")))

export const oAuth2AdminClient = (server: string) =>
  new OAuth2Api(jsonConfig(requiredServerUrl(server, "hydra")))

export const talosApiKeyClient = (server: string) =>
  new ApiKeysApi(jsonConfig(requiredServerUrl(server, "talos")))

export const relationshipReadClient = (server: string) =>
  new RelationshipApi(jsonConfig(requiredServerUrl(server, "keto_read")))

export const relationshipWriteClient = (server: string) =>
  new RelationshipApi(jsonConfig(requiredServerUrl(server, "keto_write")))

export const relationshipOPLClient = (server: string) =>
  new RelationshipApi(jsonConfig(requiredServerUrl(server, "keto_opl")))
