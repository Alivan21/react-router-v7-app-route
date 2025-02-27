import { SuccessResponse } from "@/common/types/base-response";

/**
 * Login entity type definition
 */
export type TLoginItem = {
  expires_at: string;
  token: string;
  type: string;
};

/**
 * Response type for login
 */
export type TLoginResponse = SuccessResponse<TLoginItem>;
