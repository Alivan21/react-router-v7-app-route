import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api";
import { TUserQueryParams } from "../type";
import { QUERY_KEY } from "@/common/constants/query-keys";

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
