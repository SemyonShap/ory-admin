import {
  Identity,
  GetIdentityRequest,
  ListIdentitiesRequest,
} from "@ory/client-fetch";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getIdentity, getUser, getUsers } from "../actions";
import { DEFAULT_QUERY_OPTIONS } from "./queryOptions";

export function useIdentity(id: string) {
  return useQuery<Identity | null>({
    queryKey: ["identity", id],
    queryFn: () => getIdentity(id),
    enabled: !!id,
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useUser(req: GetIdentityRequest) {
  return useQuery<Identity | null>({
    queryKey: ["user", req.id],
    queryFn: () => getUser(req),
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useUsers(req?: Omit<ListIdentitiesRequest, "pageToken">) {
  return useInfiniteQuery<{ data: Identity[]; nextToken: string | undefined }>({
    queryKey: ["users", req],
    queryFn: ({ pageParam }) =>
      getUsers({ ...req, pageToken: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export interface SubjectSuggestion {
  value: string;
  label: string;
}

export function useSubjectUsers(query: string) {
  return useQuery<SubjectSuggestion[]>({
    queryKey: ["userSuggestions", query],
    queryFn: async () => {
      const result = await getUsers({
        pageSize: 5,
        credentialsIdentifier: query,
      });
      const users =
        result.data?.map((u: Identity) => ({
          value: u.id,
          label: u.traits?.email || u.id,
        })) || [];
      return users.slice(0, 10);
    },
    enabled: query.length > 0,
    staleTime: 300_000,
  });
}
