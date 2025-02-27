import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api";
import { QUERY_KEY } from "@/common/constants/query-keys";

/**
 * Hook to fetch a single user by ID
 * @param id - The ID of the user to fetch
 */
export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEY.USER.DETAIL(id),
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  });
};
