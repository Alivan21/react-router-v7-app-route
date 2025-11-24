import { updateUser } from "@/api/users";
import { TUpdateUserRequest } from "@/api/users/schema";
import { QUERY_KEY } from "@/common/constants/query-keys";
import { useMutation } from "@/hooks/request/use-mutation";

/**
 * Hook for updating an existing user
 * @param id - The ID of the user to update
 */
export const useUpdateUserMutation = (id: string) => {
  return useMutation({
    mutationFn: (userData: TUpdateUserRequest) => updateUser(id, userData),
    meta: {
      invalidateQueries: QUERY_KEY.USER.ALL(),
    },
  });
};
