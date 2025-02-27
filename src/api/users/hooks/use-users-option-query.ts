import { QUERY_KEY } from "@/common/constants/query-keys";
import { useQuery } from "@/hooks/request/use-query";
import { getUsers } from "../api";
import { TUserQueryParams } from "../type";

/**
 * Hook to fetch users options
 * @param params - params to get user options
 */
export const useUsersOptionQuery = (params: TUserQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEY.USER.OPTIONS, params],
    queryFn: () => getUsers(params),
    select: (data) => data.data.map((user) => ({ label: user.name, value: user.id })),
  });
};
