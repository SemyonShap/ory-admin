export const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnMount: false,
  retry: false,
} as const;
