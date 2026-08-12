"use server"

import fs from "node:fs"
import { getServer, serverServiceUrl, ServerServices } from "@/lib/servers"

export interface ServiceHealth {
  name: string
  status: "ok" | "error" | "unknown"
  error?: string
}

async function checkService(url: string, name: string): Promise<ServiceHealth> {
  try {
    const res = await fetch(`${url}/health/alive`, {
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) return { name, status: "ok" }
    const body = await res.text().catch(() => "")
    return { name, status: "error", error: body || `${res.status}` }
  } catch (e: unknown) {
    return { name, status: "error", error: (e as Error).message }
  }
}

export async function getServiceHealth(
  server: string,
  service: keyof ServerServices,
): Promise<ServiceHealth> {
  const value = serverServiceUrl(server, service)
  if (!value) return { name: service, status: "unknown" }

  if (/^https?:\/\//i.test(value)) {
    return checkService(value, service)
  }

  try {
    return fs.existsSync(value)
      ? { name: service, status: "ok" }
      : { name: service, status: "error", error: `File not found: ${value}` }
  } catch (e: unknown) {
    return { name: service, status: "error", error: (e as Error).message }
  }
}

export async function getHealth(server: string): Promise<ServiceHealth[]> {
  const services = getServer(server)
  const keys = (Object.keys(services) as (keyof ServerServices)[]).filter(
    (k) => services[k],
  )
  return Promise.all(keys.map((k) => getServiceHealth(server, k)))
}
