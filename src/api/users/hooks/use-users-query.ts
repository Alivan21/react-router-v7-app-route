import { QUERY_KEY } from "@/common/constants/query-keys";
import { useQuery } from "@/hooks/request/use-query";
import { getUsers } from "../api";
import { TUserQueryParams } from "../type";

/**
 * Hook to fetch a paginated list of users
 */
export const useUsersQuery = (params: TUserQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEY.USER.LIST, params],
    queryFn: () => getUsers(params),
  });
};
