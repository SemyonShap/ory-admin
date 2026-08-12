"use server"

import {
  ListOAuth2ClientsRequest,
  CreateOAuth2ClientRequest,
} from "@ory/client-fetch"
import { getLogger } from "@/lib/logger"
import { oAuth2AdminClient } from "../utils/clients"

const log = getLogger(["app", "actions", "clients"])

export async function getClients(
  server: string,
  req?: ListOAuth2ClientsRequest,
) {
  const api = oAuth2AdminClient(server)

  const response = await api.listOAuth2ClientsRaw(req || {})
  const linkHeader = response.raw.headers.get("link")

  let nextToken: string | undefined = undefined
  if (linkHeader) {
    const match = linkHeader.match(/<[^>]*page_token=([^>]+)>;\s*rel="next"/)
    if (match) nextToken = decodeURIComponent(match[1])
  }
  const data = await response.value()

  log.info("Completed getClients", {
    count: data.length,
    nextToken: !!nextToken,
  })

  return { data, nextToken }
}

export async function createClient(
  server: string,
  req: CreateOAuth2ClientRequest,
) {
  const api = oAuth2AdminClient(server)

  const response = await api.createOAuth2Client(req)
  log.info("Completed createClient", { req })

  return response
}

export async function getClient(server: string, id: string) {
  const api = oAuth2AdminClient(server)
  const response = await api.getOAuth2Client({ id })

  log.info("Completed getClient", { id })

  return response
}

export async function deleteClient(server: string, id: string) {
  const api = oAuth2AdminClient(server)
  await api.deleteOAuth2Client({ id })

  log.info("Completed deleteClient", { id })
}
