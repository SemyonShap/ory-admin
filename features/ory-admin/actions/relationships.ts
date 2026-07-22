"use server"

import {
  GetRelationshipsRequest,
  CreateRelationshipRequest,
  Relationship,
  DeleteRelationshipsRequest,
  CheckOplSyntaxResult,
} from "@ory/client-fetch"
import {
  relationshipOPLClient,
  relationshipReadClient,
  relationshipWriteClient,
} from "../utils/clients"
import { getLogger } from "@/lib/logger"
import { loadOpl } from "../utils/loadOpl"
import { NamespacesWithRelation } from "../types"

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

export async function getNamespaces(): Promise<NamespacesWithRelation | null> {
  const local = await loadOpl()
  if (local && local.namespaces.length > 0) return local

  log.warn("OPL file not available — falling back to remote namespace list")

  const api = relationshipReadClient()
  const res = await api.listRelationshipNamespaces()
  const names = (res.namespaces ?? [])
    .map((n) => n.name)
    .filter(Boolean) as string[]
  if (names.length === 0) return null

  return {
    namespaces: names,
    namespaceRelations: Object.fromEntries(names.map((n) => [n, []])),
  }
}

export async function checkOplSyntax(
  data: string,
): Promise<CheckOplSyntaxResult> {
  const api = relationshipOPLClient()

  return await api.checkOplSyntax({ body: data })
}
