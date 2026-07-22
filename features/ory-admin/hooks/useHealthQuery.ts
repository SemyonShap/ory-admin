import { useQuery } from "@tanstack/react-query"
import { getHealth, type ServiceHealth } from "../actions/health"

export function useHealth() {
  return useQuery<ServiceHealth[]>({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 15_000,
    staleTime: 10_000,
    retry: false,
  })
}
