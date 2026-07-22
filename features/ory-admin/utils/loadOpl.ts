import fs from "node:fs"
import path from "node:path"
import { parseOPL, type NamespaceInfo } from "./parseOpl"
import { checkOplSyntax } from "../actions/relationships"
import { getLogger } from "@/lib/logger"

export interface OplConfig {
  namespaces: string[]
  namespaceRelations: Record<string, string[]>
  raw: NamespaceInfo[]
}

const log = getLogger(["app", "utils", "loadOpl"])

let cached: OplConfig | null = null

export async function loadOpl(): Promise<OplConfig | null> {
  if (cached !== null) return cached

  const filePath = path.join(process.cwd(), "opl", "namespaces.ts")
  let source: string
  try {
    source = fs.readFileSync(filePath, "utf-8")
  } catch (err) {
    log.error("Failed to read OPL file:", { error: err })
    return null
  }

  const { errors } = await checkOplSyntax(source)
  if (errors) {
    log.error("OPL syntax errors:", { errors })
    cached = null
    return null
  }

  const parsed = parseOPL(source)
  const namespaceRelations: Record<string, string[]> = {}
  for (const ns of parsed) {
    namespaceRelations[ns.name] = ns.relations.map((r) => r.name)
  }

  cached = {
    namespaces: Object.keys(namespaceRelations),
    namespaceRelations,
    raw: parsed,
  }
  return cached
}
