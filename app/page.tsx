"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Server, CircleCheck, CircleX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { useHealth } from "@/features/ory-admin/hooks"
import { Spinner } from "@/components/ui/spinner"

const services = [
  { label: "Kratos", description: "Identity and Access Management" },
  { label: "Hydra", description: "OAuth2 & OpenID Connect" },
  { label: "Keto", description: "Authorization and Permissions" },
] as const

export default function RootPage() {
  const { data, isLoading } = useHealth()

  const statusMap = new Map(data?.map((s) => [s.name, s.status]))
  const errorMap = new Map(data?.map((s) => [s.name, s.error]))
  const getStatus = (label: string) => statusMap.get(label) ?? "error"
  const getError = (label: string) => errorMap.get(label)

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((item) => (
          <Card key={item.label} className="gap-4">
            <CardHeader>
              <CardHeader className="flex flex-row gap-2 items-center p-0">
                <Server className="size-4" />
                <CardTitle>{item.label}</CardTitle>
              </CardHeader>
              <CardDescription>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 items-start">
              {isLoading ? (
                <Spinner className="size-3.5 shrink-0" />
              ) : (
                (() => {
                  const status = getStatus(item.label)
                  const error = getError(item.label)
                  const badge = (
                    <Badge
                      variant={status === "ok" ? "default" : "destructive"}
                      className="gap-1.5"
                    >
                      {status === "ok" ? (
                        <CircleCheck className="size-3" />
                      ) : (
                        <CircleX className="size-3" />
                      )}
                      {status === "ok" ? "Healthy" : "Unhealthy"}
                    </Badge>
                  )
                  return error ? (
                    <Tooltip>
                      <TooltipTrigger render={badge} />
                      <TooltipContent side="bottom">{error}</TooltipContent>
                    </Tooltip>
                  ) : (
                    badge
                  )
                })()
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
