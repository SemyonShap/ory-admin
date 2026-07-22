import { Relationship, GetRelationshipsRequest } from "@ory/client-fetch";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getRelationships,
  createRelationship,
  deleteRelationships,
} from "../actions/relationships";
import { DEFAULT_QUERY_OPTIONS } from "./queryOptions";

export function useRelationships(
  req?: Omit<GetRelationshipsRequest, "pageToken">,
) {
  return useInfiniteQuery<{
    data: Relationship[];
    nextToken: string | undefined;
  }>({
    queryKey: ["relationships", req],
    queryFn: ({ pageParam }) =>
      getRelationships({ ...req, pageToken: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextToken?.length ? lastPage.nextToken : undefined,
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useCreateRelationship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRelationship,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["relationships"] }),
  });
}

export function useDeleteRelationships() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRelationships,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["relationships"] }),
  });
}
