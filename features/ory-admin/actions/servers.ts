"use server"

import { getServers, ServerServices } from "@/lib/servers"

export interface ServerInfo {
  name: string
  services: (keyof ServerServices)[]
  oplPath?: string
}

export async function getServerList(): Promise<ServerInfo[]> {
  return Object.entries(getServers()).map(([name, services]) => ({
    name,
    oplPath: services.opl_path,
    services: Object.entries(services)
      .filter(([, url]) => !!url)
      .map(([key]) => key as keyof ServerServices),
  }))
}
