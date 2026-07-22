"use server"

import {
  GetRelationshipsRequest,
  CreateRelationshipRequest,
  Relationship,
  DeleteRelationshipsRequest,
  CheckOplSyntaxResult,
} from "@ory/client-fetch"
import {
  relationshipReadClient,
  relationshipWriteClient,
} from "../utils/clients"
import { getLogger } from "@/lib/logger"
import { loadOpl, type OplConfig } from "../utils/loadOpl"

const log = getLogger(["app", "actions", "relationships"])

export async function getRelationships(
  req?: GetRelationshipsRequest,
): Promise<{ data: Relationship[]; nextToken: string | undefined }> {
  const validatedReq = req || {}
  const api = relationshipReadClient()
  const data = await api.getRelationships(validatedReq)

  return { data: data.relation_tuples || [], nextToken: data.next_page_token }
}

export async function createRelationship(
  req: CreateRelationshipRequest,
): Promise<Relationship | null> {
  const api = relationshipWriteClient()
  const response = await api.createRelationship(req)

  log.info("Completed createRelationship", { req })
  return response
}

export async function deleteRelationships(
  req: DeleteRelationshipsRequest,
): Promise<void> {
  const api = relationshipWriteClient()
  await api.deleteRelationships(req)

  log.info("Completed deleteRelationships", { req })
}

export async function getOpl(): Promise<OplConfig | null> {
  return loadOpl()
}

export async function checkOplSyntax(
  data: string,
): Promise<CheckOplSyntaxResult> {
  const api = relationshipWriteClient()

  return await api.checkOplSyntax({ body: data })
}
