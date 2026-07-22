import { parseOPL, type NamespaceInfo } from "./parseOPL"

export interface OplConfig {
  namespaces: string[]
  namespaceRelations: Record<string, string[]>
  raw: NamespaceInfo[]
}

const OPL_SCHEMA_PATH = process.env.OPL_SCHEMA_PATH

let cached: OplConfig | null = null

function buildConfig(filePath: string): OplConfig {
  const parsed = parseOPL(filePath)

  const namespaceRelations: Record<string, string[]> = {}
  for (const ns of parsed) {
    namespaceRelations[ns.name] = ns.relations.map((r) => r.name)
  }

  return {
    namespaces: Object.keys(namespaceRelations),
    namespaceRelations,
    raw: parsed,
  }
}

export function getOplConfig(): OplConfig {
  if (cached) return cached

  if (!OPL_SCHEMA_PATH) {
    throw new Error(
      "OPL_SCHEMA_PATH is not set — point it at the namespaces.ts file mounted into the container",
    )
  }

  cached = buildConfig(OPL_SCHEMA_PATH)
  return cached
}
