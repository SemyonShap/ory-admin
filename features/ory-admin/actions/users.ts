"use server"

import {
  GetIdentityRequest,
  ListIdentitiesRequest,
  IdentityStateEnum,
  JsonPatchOpEnum,
} from "@ory/client-fetch"
import { getLogger } from "@/lib/logger"
import { identityAdminClient } from "../utils/clients"

const log = getLogger(["app", "actions", "users"])

export async function getIdentity(server: string, id: string) {
  const api = identityAdminClient(server)
  const identity = await api.getIdentity({ id })

  log.info("Completed getIdentity", { id })

  return identity
}

export async function getUser(server: string, req: GetIdentityRequest) {
  const api = identityAdminClient(server)
  const response = await api.getIdentityRaw(req)
  const data = await response.value()

  log.info("Completed getUser", { id: req.id })

  return data
}

export async function getUsers(server: string, req?: ListIdentitiesRequest) {
  const api = identityAdminClient(server)
  const response = await api.listIdentitiesRaw(req || {})

  const linkHeader = response.raw.headers.get("link")
  let nextToken: string | undefined = undefined

  if (linkHeader) {
    const match = linkHeader.match(/<[^>]*page_token=([^>]+)>;\s*rel="next"/)
    if (match) nextToken = decodeURIComponent(match[1])
  }

  const data = await response.value()

  return { data, nextToken }
}

export async function setUserState(
  server: string,
  id: string,
  state: IdentityStateEnum,
) {
  const api = identityAdminClient(server)
  await api.patchIdentity({
    id,
    jsonPatch: [{ op: JsonPatchOpEnum.Replace, path: "/state", value: state }],
  })

  log.info("Completed setUserState", { id, state })
}
