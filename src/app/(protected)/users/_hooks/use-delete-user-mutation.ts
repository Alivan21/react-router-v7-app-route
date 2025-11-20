import { deleteUser } from "@/api/users";
import { QUERY_KEY } from "@/common/constants/query-keys";
import { useMutation } from "@/hooks/request/use-mutation";

/**
 * Hook to delete a user
 * @param id - The ID of the user to delete
 */
export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    meta: {
      invalidateQueries: [QUERY_KEY.USER.ALL],
    },
  });
};
