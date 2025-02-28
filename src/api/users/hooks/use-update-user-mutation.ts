import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/common/constants/query-keys";
import { useMutation } from "@/hooks/request/use-mutation";
import { updateUser } from "../api";
import { TUpdateUserRequest } from "../schema";

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
        queryKey: [QUERY_KEY.USER.DETAIL, id],
      });
    },
  });
};
