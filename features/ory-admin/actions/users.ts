"use server";

import { GetIdentityRequest, ListIdentitiesRequest } from "@ory/client-fetch";
import { getLogger } from "@/lib/logger";
import { identityAdminClient } from "../utils/clients";

const log = getLogger(["app", "actions", "users"]);

export async function getIdentity(id: string) {

	const api = identityAdminClient();
  const identity = await api.getIdentity({ id });

  log.info("Completed getIdentity", { id });

  return identity;
}

export async function getUser(req: GetIdentityRequest) {

  const api = identityAdminClient();
  const response = await api.getIdentityRaw(req);
  const data = await response.value();

  log.info("Completed getUser", { id: req.id });
	
  return data;
}

export async function getUsers(req?: ListIdentitiesRequest) {
  const api = identityAdminClient();
  const response = await api.listIdentitiesRaw(req || {});

  const linkHeader = response.raw.headers.get("link");
  let nextToken: string | undefined = undefined;

  if (linkHeader) {
    const match = linkHeader.match(/<[^>]*page_token=([^>]+)>;\s*rel="next"/);
    if (match) nextToken = decodeURIComponent(match[1]);
  }

  const data = await response.value();

  return { data, nextToken };
}
