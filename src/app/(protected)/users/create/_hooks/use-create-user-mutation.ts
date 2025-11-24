import { createUser } from "@/api/users";
import { TCreateUserRequest } from "@/api/users/schema";
import { QUERY_KEY } from "@/common/constants/query-keys";
import { useMutation } from "@/hooks/request/use-mutation";

/**
 * Hook for creating a new user
 */
export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: (userData: TCreateUserRequest) => createUser(userData),
    meta: {
      invalidateQueries: QUERY_KEY.USER.ALL(),
    },
  });
};
