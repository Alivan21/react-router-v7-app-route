import { ApiResponse, PaginatedResponse, SuccessResponse } from "@/common/types/base-response";

/**
 * User entity type definition
 */
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

/**
 * Parameters for querying users
 */
export interface TUserQueryParams {
  page?: number;
  limit?: number;
  per_page?: number;
  search?: string;
  sort_by?: "name" | "email" | "created_at" | "updated_at" | "phone_number";
  sort_order?: "asc" | "desc";
}

/**
 * Response type for retrieving a single user
 */
export type TUserResponse = SuccessResponse<TUserItem>;

/**
 * Response type for retrieving a list of users
 */
export type TUserListResponse = PaginatedResponse<TUserItem>;

/**
 * General type for any user-related API response
 */
export type TUserApiResponse = ApiResponse<TUserItem | TUserItem[] | null>;
