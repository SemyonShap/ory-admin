"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, CircleCheck, CircleX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { useServers, useServiceHealth } from "@/features/ory-admin/hooks"
import { Spinner } from "@/components/ui/spinner"
import { useServerStore } from "@/store/serverStore"
import { Alert, AlertDescription } from "@/components/ui/alert"

const SERVICE_INFO: Record<string, { label: string; description: string }> = {
  kratos: { label: "Kratos", description: "Identity and Access Management" },
  hydra: { label: "Hydra", description: "OAuth2 & OpenID Connect" },
  keto_read: { label: "Keto Read", description: "Keto Read API" },
  keto_write: { label: "Keto Write", description: "Keto Write API" },
  keto_opl: { label: "Keto OPL", description: "Keto OPL Syntax Check" },
  talos: { label: "Talos", description: "Ory Talos" },
  opl_path: { label: "OPL Path", description: "OPL namespaces file" },
}

function ServiceStatus({
  service,
}: {
  service: { status: string; error?: string }
}) {
  const badge = (
    <Badge
      variant={service.status === "ok" ? "default" : "destructive"}
      className="gap-1.5"
    >
      {service.status === "ok" ? (
        <CircleCheck className="size-3" />
      ) : (
        <CircleX className="size-3" />
      )}
      {service.status === "ok" ? "Healthy" : "Unhealthy"}
    </Badge>
  )
  return service.error ? (
    <Tooltip>
      <TooltipTrigger render={badge} />
      <TooltipContent side="bottom">{service.error}</TooltipContent>
    </Tooltip>
  ) : (
    badge
  )
}

function ServiceRow({ server, service }: { server: string; service: string }) {
  const { data, isLoading } = useServiceHealth(server, service)
  const info = SERVICE_INFO[service] ?? { label: service, description: "" }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{info.label}</span>
        <span className="text-xs text-muted-foreground">
          {info.description}
        </span>
      </div>
      <div className="flex w-24 shrink-0 items-center justify-end">
        {isLoading || !data ? (
          <Spinner className="size-3.5" />
        ) : (
          <ServiceStatus service={data} />
        )}
      </div>
    </div>
  )
}

function ServerCard({
  name,
  services,
  active,
  onSelect,
}: {
  name: string
  services: string[]
  active: boolean
  onSelect: () => void
}) {
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer ${active ? "ring-2 ring-ring" : ""}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="size-4" />
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {services.map((service) => (
          <ServiceRow key={service} server={name} service={service} />
        ))}
      </CardContent>
    </Card>
  )
}

export default function RootPage() {
  const { data: servers = [] } = useServers()
  const isLoading = useServerStore((s) => s.isLoading)
  const activeServer = useServerStore((s) => s.activeServer)
  const setActiveServer = useServerStore((s) => s.setActiveServer)
  const isSingleServer = servers.length <= 1

  return (
    <div className="flex flex-col gap-4 p-2">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Welcome to Ory Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the sidebar to navigate through the admin panel.
          </p>
        </CardContent>
      </Card>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : servers.length === 0 ? (
        <Alert variant="destructive">
          <AlertDescription>No servers configured</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servers.map((srv) => (
            <ServerCard
              key={srv.name}
              name={srv.name}
              services={srv.services}
              active={!isSingleServer && srv.name === activeServer}
              onSelect={() => setActiveServer(srv.name)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
