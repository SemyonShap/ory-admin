import fs from "node:fs"
import path from "node:path"
import { parseOPL } from "./parseOpl"
import { checkOplSyntax } from "../actions/relationships"
import { getLogger } from "@/lib/logger"
import { oplUrlEnv, oplPathEnv } from "@/lib/env"
import { NamespacesWithRelation } from "../types"

const log = getLogger(["app", "utils", "loadOpl"])

let cached: Promise<NamespacesWithRelation> | null = null

export function loadOpl(): Promise<NamespacesWithRelation> {
  if (cached) return cached

  cached = (async () => {
    const fallback = {
      namespaces: [],
      namespaceRelations: {},
    }
    const extraPath = oplPathEnv()
    const filepath = extraPath ?? path.join(process.cwd(), "namespaces.ts")

    let source: string
    try {
      source = fs.readFileSync(filepath, "utf-8")
    } catch (err) {
      log.error("Failed to read OPL file:", { error: err })
      return fallback
    }

    if (!source) {
      log.error("OPL is empty")
      return fallback
    }

    if (oplUrlEnv()) {
      const { errors } = await checkOplSyntax(source)
      if (errors) {
        log.error("OPL syntax errors:", { errors })
        return fallback
      }
    } else {
      log.warn("Skipping check opl syntax")
    }

    const parsed = parseOPL(source)
    const namespaceRelations: Record<string, string[]> = {}
    for (const ns of parsed) {
      namespaceRelations[ns.name] = ns.relations.map((r) => r.name)
    }

    return {
      namespaces: Object.keys(namespaceRelations),
      namespaceRelations,
    }
  })()

  return cached
}
