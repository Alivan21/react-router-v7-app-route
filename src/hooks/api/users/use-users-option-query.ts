import { getUsers } from "@/api/users";
import { TUserQueryParams } from "@/api/users/type";
import { QUERY_KEY } from "@/common/constants/query-keys";
import { useQuery } from "@/hooks/request/use-query";

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
