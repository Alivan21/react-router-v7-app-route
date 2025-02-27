import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api";
import { QUERY_KEY } from "@/common/constants/query-keys";

export const useUsersOptionQuery = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [QUERY_KEY.USER.OPTIONS, page, limit],
    queryFn: () => getUsers(page, limit),
    select: (data) => data.data.map((user) => ({ label: user.name, value: user.id })),
  });
};
