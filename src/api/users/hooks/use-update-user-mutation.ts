import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api";
import { UpdateUserRequest } from "../schema";
import { QUERY_KEY } from "@/common/constants/query-keys";

/**
 * Hook for updating an existing user
 */
export const useUpdateUserMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UpdateUserRequest) => updateUser(id, userData),
    onSuccess: async () => {
      // Update both the list and the detail queries
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.USER.LIST],
      });

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.USER.DETAIL(id),
      });
    },
  });
};
