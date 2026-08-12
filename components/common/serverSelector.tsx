"use client"

import { useEffect } from "react"
import { Server } from "lucide-react"
import { useServers } from "@/features/ory-admin/hooks/useServersQuery"
import { useServerStore } from "@/store/serverStore"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ServerSelector() {
  const { data: servers = [] } = useServers()
  const activeServer = useServerStore((s) => s.activeServer)
  const setActiveServer = useServerStore((s) => s.setActiveServer)

  const isValid = servers.some((s) => s.name === activeServer)
  const value = isValid ? activeServer : (servers[0]?.name ?? "")

  useEffect(() => {
    if (!isValid && servers[0]) setActiveServer(servers[0].name)
  }, [isValid, servers, setActiveServer])

  return (
    <Select
      value={value}
      onValueChange={(v) => v && setActiveServer(v)}
      disabled={servers.length <= 1}
    >
      <SelectTrigger className="w-full">
        <Server className="size-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {servers.map((s) => (
          <SelectItem key={s.name} value={s.name}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
