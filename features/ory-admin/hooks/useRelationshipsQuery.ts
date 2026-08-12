import {
  Relationship,
  GetRelationshipsRequest,
  CreateRelationshipRequest,
  DeleteRelationshipsRequest,
} from "@ory/client-fetch"
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import {
  getRelationships,
  createRelationship,
  deleteRelationships,
  getNamespaces,
} from "../actions/relationships"
import { DEFAULT_QUERY_OPTIONS } from "./queryOptions"
import { toast } from "sonner"
import { NamespacesWithRelation } from "../types"
import { useServerStore } from "@/store/serverStore"

export function useRelationships(
  req?: Omit<GetRelationshipsRequest, "pageToken">,
) {
  const server = useServerStore((s) => s.activeServer)
  return useInfiniteQuery<{
    data: Relationship[]
    nextToken: string | undefined
  }>({
    queryKey: ["relationships", server, req],
    queryFn: ({ pageParam }) =>
      getRelationships(server, {
        ...req,
        pageToken: pageParam as string | undefined,
      }),
    enabled: !!server,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextToken?.length ? lastPage.nextToken : undefined,
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export function useCreateRelationship() {
  const server = useServerStore((s) => s.activeServer)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateRelationshipRequest) =>
      createRelationship(server, req),
    onSuccess: () =>
      queryClient.resetQueries({ queryKey: ["relationships", server] }),
  })
}

export function useDeleteRelationships() {
  const server = useServerStore((s) => s.activeServer)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: DeleteRelationshipsRequest) =>
      deleteRelationships(server, req),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["relationships", server] }),
  })
}

export function useNamespaces() {
  const server = useServerStore((s) => s.activeServer)
  return useQuery<NamespacesWithRelation | null>({
    queryKey: ["opl", server],
    queryFn: async () => {
      const result = await getNamespaces(server)
      if (!result) toast.error("Failed to load OPL config")
      return result
    },
    enabled: !!server,
    ...DEFAULT_QUERY_OPTIONS,
  })
}
