"use server"

import { kratosAdminUrl, hydraAdminUrl, ketoWriteUrl } from "@/lib/sdk"

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

export async function getHealth(): Promise<ServiceHealth[]> {
  const services = [
    { url: kratosAdminUrl(), name: "Kratos" },
    { url: hydraAdminUrl(), name: "Hydra" },
    { url: ketoWriteUrl(), name: "Keto" },
  ]
  return Promise.all(services.map((s) => checkService(s.url, s.name)))
}
