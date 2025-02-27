import { ApiResponse, PaginatedResponse, SuccessResponse } from "../../common/types/base-response";

/**
 * User entity type definition
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Response type for retrieving a single user
 */
export type UserResponse = SuccessResponse<User>;

/**
 * Response type for retrieving a list of users
 */
export type UserListResponse = PaginatedResponse<User>;

/**
 * General type for any user-related API response
 */
export type UserApiResponse = ApiResponse<User | User[] | null>;
