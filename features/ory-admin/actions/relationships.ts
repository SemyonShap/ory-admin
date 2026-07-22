"use server"

import {
  GetRelationshipsRequest,
  CreateRelationshipRequest,
  Relationship,
  DeleteRelationshipsRequest,
} from "@ory/client-fetch"
import {
  relationshipReadClient,
  relationshipWriteClient,
} from "../utils/clients"
import { getLogger } from "@/lib/logger"

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
