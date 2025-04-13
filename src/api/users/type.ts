import { ApiResponse, PaginatedResponse, SuccessResponse } from "@/common/types/base-response";

export interface TUserItem {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  status?: "active" | "inactive";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TUserQueryParams {
  page?: number;
  limit?: number;
  per_page?: number;
  search?: string;
  sort_by?: "name" | "email" | "created_at" | "updated_at" | "phone_number";
  sort_order?: "asc" | "desc";
}

export type TUserResponse = SuccessResponse<TUserItem>;
export type TUserListResponse = PaginatedResponse<TUserItem>;
export type TUserApiResponse = ApiResponse<TUserItem | TUserItem[] | null>;
