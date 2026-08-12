import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getServerList, ServerInfo } from "../actions/servers"
import { useServerStore } from "@/store/serverStore"

export function useServers() {
  const setLoading = useServerStore((s) => s.setLoading)
  const query = useQuery<ServerInfo[]>({
    queryKey: ["servers"],
    queryFn: getServerList,
    staleTime: Infinity,
  })

  useEffect(() => {
    setLoading(query.isPending)
  }, [query.isPending, setLoading])

  return query
}
