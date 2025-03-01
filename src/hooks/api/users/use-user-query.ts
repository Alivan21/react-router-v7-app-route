import { getUserById } from "@/api/users";
import { QUERY_KEY } from "@/common/constants/query-keys";
import { useQuery } from "@/hooks/request/use-query";

/**
 * Hook to fetch a single user by ID
 * @param id - The ID of the user to fetch
 */
export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.USER.DETAIL, id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  });
};
