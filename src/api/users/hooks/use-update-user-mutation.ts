import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api";
import { TUpdateUserRequest } from "../schema";
import { QUERY_KEY } from "@/common/constants/query-keys";

/**
 * Hook for updating an existing user
 * @param id - The ID of the user to update
 */
export const useUpdateUserMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: TUpdateUserRequest) => updateUser(id, userData),
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
