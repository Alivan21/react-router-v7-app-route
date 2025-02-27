import { useMutation } from "@tanstack/react-query";
import { login } from "../api";
import { TLoginRequest } from "../schema";

/**
 * Hook for user login mutation
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: TLoginRequest) => login(credentials),
  });
};
