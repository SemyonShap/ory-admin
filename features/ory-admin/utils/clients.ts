import {
  Configuration,
  OAuth2Api,
  IdentityApi,
  RelationshipApi,
} from "@ory/client-fetch"
import {
  kratosAdminUrl,
  hydraAdminUrl,
  ketoWriteUrl,
  ketoReadUrl,
  ketoOplUrl,
} from "@/lib/env"

const jsonConfig = (basePath: string) =>
  new Configuration({
    basePath,
    headers: { Accept: "application/json" },
  })

export const identityAdminClient = () =>
  new IdentityApi(jsonConfig(kratosAdminUrl()))

export const oAuth2AdminClient = () =>
  new OAuth2Api(jsonConfig(hydraAdminUrl()))

export const relationshipReadClient = () =>
  new RelationshipApi(jsonConfig(ketoReadUrl()))

export const relationshipWriteClient = () =>
  new RelationshipApi(jsonConfig(ketoWriteUrl()))

export const relationshipOPLClient = () =>
  new RelationshipApi(jsonConfig(ketoOplUrl()))
