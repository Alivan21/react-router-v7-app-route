import { SuccessResponse } from "@/common/types/base-response";

export type TLoginItem = {
  expires_at: string;
  token: string;
  type: string;
};

export type TLoginResponse = SuccessResponse<TLoginItem>;
