import { useQuery } from "@tanstack/react-query"
import { getServiceHealth, type ServiceHealth } from "../actions/health"
import type { ServerServices } from "@/lib/servers"

export function useServiceHealth(server: string, service: string) {
  return useQuery<ServiceHealth>({
    queryKey: ["health", server, service],
    queryFn: () => getServiceHealth(server, service as keyof ServerServices),
    enabled: !!server && !!service,
    refetchInterval: 60_000,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: false,
  })
}
