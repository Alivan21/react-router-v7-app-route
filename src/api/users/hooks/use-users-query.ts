import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api";
import { QUERY_KEY } from "@/common/constants/query-keys";

/**
 * Hook to fetch a paginated list of users
 */
export const useUsersQuery = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [QUERY_KEY.USER.LIST, page, limit],
    queryFn: () => getUsers(page, limit),
  });
};
