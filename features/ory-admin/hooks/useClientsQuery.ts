import { ListOAuth2ClientsRequest, OAuth2Client } from "@ory/client-fetch";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import {
  createClient,
  getClients,
  getClient,
  deleteClient,
} from "../actions/oauth2_clients";
import { DEFAULT_QUERY_OPTIONS } from "./queryOptions";
import { toast } from "sonner";

export function useClients(req?: Omit<ListOAuth2ClientsRequest, "pageToken">) {
  return useInfiniteQuery<{
    data: OAuth2Client[];
    nextToken: string | undefined;
  }>({
    queryKey: ["clients", req],
    queryFn: ({ pageParam }) =>
      getClients({ ...req, pageToken: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useClient(id: string) {
  return useQuery<OAuth2Client | null>({
    queryKey: ["client", id],
    enabled: !!id,
    queryFn: () => getClient(id),
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      if (!data) {
        toast.error("Failed to create client: no data returned");
      }

      toast.success("Create a new oauth client");

      return data;
    },
    onError: (error: Error) => {
      toast.error("Failed to create client: " + error.message);
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(`Client ${variables} delete`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete client: ${error.message}`);
    },
  });
}
