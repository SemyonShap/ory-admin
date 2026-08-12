import {
  AdminListIssuedApiKeysRequest,
  IssueApiKeyRequest,
  IssuedApiKey,
} from "@ory/client-fetch"
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import {
  getApiKeys,
  getApiKey,
  issueApiKey,
  revokeApiKey,
} from "../actions/apiKeys"
import { DEFAULT_QUERY_OPTIONS } from "./queryOptions"
import { useServerStore } from "@/store/serverStore"
import { toast } from "sonner"

export function useApiKeys(
  req?: Omit<AdminListIssuedApiKeysRequest, "pageToken">,
) {
  const server = useServerStore((s) => s.activeServer)
  return useInfiniteQuery<{
    data: IssuedApiKey[]
    nextToken: string | undefined
  }>({
    queryKey: ["apiKeys", server, req],
    queryFn: ({ pageParam }) =>
      getApiKeys(server, {
        ...req,
        pageToken: pageParam as string | undefined,
      }),
    enabled: !!server,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export function useApiKey(keyId: string) {
  const server = useServerStore((s) => s.activeServer)
  return useQuery<IssuedApiKey | null>({
    queryKey: ["apiKey", server, keyId],
    queryFn: () => getApiKey(server, keyId),
    enabled: !!keyId && !!server,
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export function useRevokeApiKey() {
  const server = useServerStore((s) => s.activeServer)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (keyId: string) => revokeApiKey(server, keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys", server] })
      toast.success("API key revoked")
    },
    onError: (error: Error) => {
      toast.error("Failed to revoke API key: " + error.message)
    },
  })
}

export function useCreateApiKey() {
  const server = useServerStore((s) => s.activeServer)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: IssueApiKeyRequest) => issueApiKey(server, req),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["apiKeys", server] })
    },
    onError: (error: Error) => {
      toast.error("Failed to create API key: " + error.message)
    },
  })
}
