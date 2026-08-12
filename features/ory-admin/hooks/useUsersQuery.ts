import {
  Identity,
  GetIdentityRequest,
  ListIdentitiesRequest,
  IdentityStateEnum,
} from "@ory/client-fetch"
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { getIdentity, getUser, getUsers, setUserState } from "../actions"
import { DEFAULT_QUERY_OPTIONS } from "./queryOptions"
import { useServerStore } from "@/store/serverStore"
import { toast } from "sonner"

export function useIdentity(id: string) {
  const server = useServerStore((s) => s.activeServer)
  return useQuery<Identity | null>({
    queryKey: ["identity", server, id],
    queryFn: () => getIdentity(server, id),
    enabled: !!id && !!server,
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export function useUser(req: GetIdentityRequest) {
  const server = useServerStore((s) => s.activeServer)
  return useQuery<Identity | null>({
    queryKey: ["user", server, req.id],
    queryFn: () => getUser(server, req),
    enabled: !!server,
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export function useUsers(req?: Omit<ListIdentitiesRequest, "pageToken">) {
  const server = useServerStore((s) => s.activeServer)
  return useInfiniteQuery<{ data: Identity[]; nextToken: string | undefined }>({
    queryKey: ["users", server, req],
    queryFn: ({ pageParam }) =>
      getUsers(server, { ...req, pageToken: pageParam as string | undefined }),
    enabled: !!server,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export interface SubjectSuggestion {
  value: string
  label: string
}

export function useSubjectUsers(query: string) {
  const server = useServerStore((s) => s.activeServer)
  return useQuery<SubjectSuggestion[]>({
    queryKey: ["userSuggestions", server, query],
    queryFn: async () => {
      const result = await getUsers(server, {
        pageSize: 5,
        credentialsIdentifier: query,
      })
      const users =
        result.data?.map((u: Identity) => ({
          value: u.id,
          label: u.traits?.email || u.id,
        })) || []
      return users.slice(0, 10)
    },
    enabled: query.length > 0 && !!server,
    staleTime: 300_000,
  })
}

export function useSetUserState() {
  const server = useServerStore((s) => s.activeServer)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, state }: { id: string; state: IdentityStateEnum }) =>
      setUserState(server, id, state),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", server],
        refetchType: "all",
      })
      queryClient.invalidateQueries({
        queryKey: ["user", server],
        refetchType: "all",
      })
      queryClient.invalidateQueries({
        queryKey: ["identity", server],
        refetchType: "all",
      })
    },
    onError: (error: Error) => {
      toast.error("Failed to update user: " + error.message)
    },
  })
}
