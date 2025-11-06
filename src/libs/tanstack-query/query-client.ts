import { MutationCache, QueryClient, type InvalidateQueryFilters } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
  mutationCache: new MutationCache({
    async onSettled(_data, _error, _variables, _context, mutation) {
      if (mutation.meta?.invalidateQueries) {
        await queryClient.invalidateQueries(
          mutation.meta.invalidateQueries as InvalidateQueryFilters<readonly unknown[]>
        );
      }
    },
  }),
});
