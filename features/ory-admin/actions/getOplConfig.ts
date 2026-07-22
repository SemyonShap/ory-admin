"use server"

import { getOplConfig, type OplConfig } from "../utils/oplRuntimeConfig"

export async function fetchOplConfigAction(): Promise<OplConfig> {
  return getOplConfig()
}
