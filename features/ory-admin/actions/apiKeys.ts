"use server"

import {
  AdminListIssuedApiKeysRequest,
  IssueApiKeyRequest,
  IssueApiKeyResponse,
  IssuedApiKey,
} from "@ory/client-fetch"
import { getLogger } from "@/lib/logger"
import { talosApiKeyClient } from "../utils/clients"

const log = getLogger(["app", "actions", "apiKeys"])

export async function getApiKeys(
  server: string,
  req?: AdminListIssuedApiKeysRequest,
): Promise<{ data: IssuedApiKey[]; nextToken: string | undefined }> {
  const api = talosApiKeyClient(server)
  const res = await api.adminListIssuedApiKeys(req || {})

  return {
    data: res.issued_api_keys ?? [],
    nextToken: res.next_page_token || undefined,
  }
}

export async function getApiKey(server: string, keyId: string) {
  const api = talosApiKeyClient(server)
  const key = await api.adminGetIssuedApiKey({ keyId })

  log.info("Completed getApiKey", { keyId })
  return key
}

export async function issueApiKey(
  server: string,
  req: IssueApiKeyRequest,
): Promise<IssueApiKeyResponse> {
  const api = talosApiKeyClient(server)
  const response = await api.adminIssueApiKey({ issueApiKeyRequest: req })

  log.info("Completed issueApiKey", { req })
  return response
}

export async function revokeApiKey(server: string, keyId: string) {
  const api = talosApiKeyClient(server)
  await api.adminRevokeIssuedApiKey({
    keyId,
    adminRevokeIssuedApiKeyBody: {},
  })

  log.info("Completed revokeApiKey", { keyId })
}
