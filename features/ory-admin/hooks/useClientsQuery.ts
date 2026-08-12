import {
  ListOAuth2ClientsRequest,
  OAuth2Client,
  CreateOAuth2ClientRequest,
} from "@ory/client-fetch"
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query"
import {
  createClient,
  getClients,
  getClient,
  deleteClient,
} from "../actions/oauth2_clients"
import { DEFAULT_QUERY_OPTIONS } from "./queryOptions"
import { toast } from "sonner"
import { useServerStore } from "@/store/serverStore"

export function useClients(req?: Omit<ListOAuth2ClientsRequest, "pageToken">) {
  const server = useServerStore((s) => s.activeServer)
  return useInfiniteQuery<{
    data: OAuth2Client[]
    nextToken: string | undefined
  }>({
    queryKey: ["clients", server, req],
    queryFn: ({ pageParam }) =>
      getClients(server, {
        ...req,
        pageToken: pageParam as string | undefined,
      }),
    enabled: !!server,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export function useClient(id: string) {
  const server = useServerStore((s) => s.activeServer)
  return useQuery<OAuth2Client | null>({
    queryKey: ["client", server, id],
    enabled: !!id && !!server,
    queryFn: () => getClient(server, id),
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export function useCreateClient() {
  const server = useServerStore((s) => s.activeServer)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateOAuth2ClientRequest) => createClient(server, req),
    onSuccess: (data) => {
      queryClient.resetQueries({ queryKey: ["clients", server] })
      if (!data) {
        toast.error("Failed to create client: no data returned")
      }

      toast.success("Create a new oauth client")

      return data
    },
    onError: (error: Error) => {
      toast.error("Failed to create client: " + error.message)
    },
  })
}

export function useDeleteClient() {
  const server = useServerStore((s) => s.activeServer)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteClient(server, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients", server] })
      toast.success(`Client ${variables} delete`)
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete client: ${error.message}`)
    },
  })
}
