import { Relationship, GetRelationshipsRequest } from "@ory/client-fetch"
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
  getOpl,
} from "../actions/relationships"
import type { OplConfig } from "../utils/loadOpl"
import { DEFAULT_QUERY_OPTIONS } from "./queryOptions"
import { toast } from "sonner"

export function useRelationships(
  req?: Omit<GetRelationshipsRequest, "pageToken">,
) {
  return useInfiniteQuery<{
    data: Relationship[]
    nextToken: string | undefined
  }>({
    queryKey: ["relationships", req],
    queryFn: ({ pageParam }) =>
      getRelationships({ ...req, pageToken: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextToken?.length ? lastPage.nextToken : undefined,
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export function useCreateRelationship() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRelationship,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["relationships"] }),
  })
}

export function useDeleteRelationships() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRelationships,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["relationships"] }),
  })
}

export function useOpl() {
  return useQuery<OplConfig | null>({
    queryKey: ["opl"],
    queryFn: async () => {
      const result = await getOpl()
      if (!result) toast.error("Failed to load OPL config")
      return result
    },
    ...DEFAULT_QUERY_OPTIONS,
  })
}
