import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api";
import { TCreateUserRequest } from "../schema";
import { QUERY_KEY } from "@/common/constants/query-keys";

/**
 * Hook for creating a new user
 */
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: TCreateUserRequest) => createUser(userData),
    onSuccess: async () => {
      // Invalidate and refetch the user list
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.USER.LIST],
      });
    },
  });
};
