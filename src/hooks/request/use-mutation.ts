import {
  QueryClient,
  UseMutationOptions,
  useMutation as useMutationOrigin,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/common/types/base-response";

export const useMutation = <
  TData = unknown,
  TError = AxiosError<ErrorResponse>,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  queryClient?: QueryClient
) => useMutationOrigin<TData, TError, TVariables, TContext>(options, queryClient);
