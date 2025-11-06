import { deleteUser } from "@/api/users";
import { QUERY_KEY } from "@/common/constants/query-keys";
import { useMutation } from "@/hooks/request/use-mutation";

/**
 * Hook to delete a user
 * @param id - The ID of the user to delete
 */
export const useDeleteUserMutation = (id: string) => {
  return useMutation({
    mutationFn: () => deleteUser(id),
    meta: {
      invalidatesQueries: [QUERY_KEY.USER.ALL],
    },
  });
};
