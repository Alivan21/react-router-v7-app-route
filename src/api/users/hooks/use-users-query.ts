import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api";
import { TUserQueryParams } from "../type";
import { QUERY_KEY } from "@/common/constants/query-keys";

/**
 * Hook to fetch a paginated list of users
 */
export const useUsersQuery = (params: TUserQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEY.USER.LIST, params],
    queryFn: () => getUsers(params),
  });
};
