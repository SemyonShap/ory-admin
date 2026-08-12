import fs from "node:fs"
import path from "node:path"

export type ServerServices = {
  kratos?: string
  hydra?: string
  talos?: string
  keto_opl?: string
  keto_read?: string
  keto_write?: string
  opl_path?: string
}

export type ServerConfig = Record<string, ServerServices>

export const getEnv = (envName: string): string | undefined => {
  return process.env[envName]
}

const defaultConfigPath = path.join(process.cwd(), "tmp", "config.json")

let cached: ServerConfig | null = null

function loadConfig(): ServerConfig {
  if (cached) return cached
  const configPath = getEnv("CONFIG_PATH") ?? defaultConfigPath
  try {
    const raw = fs.readFileSync(configPath, "utf-8")
    cached = JSON.parse(raw) as ServerConfig
  } catch {
    cached = {}
  }
  return cached
}

export function getServers(): ServerConfig {
  return loadConfig()
}

export function getServer(name: string): ServerServices {
  return getServers()[name] ?? {}
}

export function serverServiceUrl(
  name: string,
  key: keyof ServerServices,
): string | undefined {
  return getServer(name)[key]?.replace(/\/$/, "")
}

export function serverOplPath(name: string): string | undefined {
  return getServer(name).opl_path
}

export function requiredServerUrl(
  name: string,
  key: keyof ServerServices,
): string {
  const url = serverServiceUrl(name, key)
  if (!url) throw new Error(`Missing "${key}" URL for server "${name}"`)
  return url
}
