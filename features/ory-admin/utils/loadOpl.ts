import fs from "node:fs"
import { parseOPL } from "./parseOpl"
import { checkOplSyntax } from "../actions/relationships"
import { getLogger } from "@/lib/logger"
import { serverServiceUrl, serverOplPath } from "@/lib/servers"
import { NamespacesWithRelation } from "../types"

const log = getLogger(["app", "utils", "loadOpl"])

const cache = new Map<string, Promise<NamespacesWithRelation>>()

export function loadOpl(server: string): Promise<NamespacesWithRelation> {
  const cached = cache.get(server)
  if (cached) return cached

  const promise = (async () => {
    const fallback = {
      namespaces: [],
      namespaceRelations: {},
    }
    const filepath = serverOplPath(server)
    if (!filepath) {
      log.warn("No OPL path configured for server", { server })
      return fallback
    }

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

    if (serverServiceUrl(server, "keto_opl")) {
      const { errors } = await checkOplSyntax(server, source)
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

  cache.set(server, promise)
  return promise
}
