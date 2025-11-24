import { MutationCache, QueryClient, QueryKey } from "@tanstack/react-query";

export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onSettled: (_data, _error, _variables, _context, mutation) => {
      // If meta.invalidateQueries is provided, invalidate those specific queries
      // Otherwise, invalidate all queries
      const invalidateQueries = mutation.meta?.invalidateQueries;
      if (invalidateQueries) {
        const queryKeys = (
          Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries]
        ) as QueryKey[];

        queryKeys.forEach((queryKey) => {
          void queryClient.invalidateQueries({ queryKey });
        });
      } else {
        void queryClient.invalidateQueries();
      }
    },
  }),
});
