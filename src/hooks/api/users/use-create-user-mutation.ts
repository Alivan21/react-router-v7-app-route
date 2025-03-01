import { useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/api/users";
import { TCreateUserRequest } from "@/api/users/schema";
import { QUERY_KEY } from "@/common/constants/query-keys";
import { useMutation } from "@/hooks/request/use-mutation";

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
