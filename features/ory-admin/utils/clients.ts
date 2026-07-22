import {
  Configuration,
  OAuth2Api,
  IdentityApi,
  RelationshipApi,
} from "@ory/client-fetch";
import { adminUrl } from "../../../lib/sdk";

const jsonConfig = (basePath: string) =>
  new Configuration({
    basePath,
    headers: { Accept: "application/json" },
  });

export const identityAdminClient = () =>
  new IdentityApi(jsonConfig(`${adminUrl()}/kratos`));

export const oAuth2AdminClient = () =>
  new OAuth2Api(jsonConfig(`${adminUrl()}/hydra`));

export const relationshipClient = () =>
  new RelationshipApi(jsonConfig(`${adminUrl()}/keto`));