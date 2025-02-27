/**
 * Base API response interface that all response types should extend
 */
export interface BaseResponse {
  message: string;
  timestamp: string;
}

/**
 * Standard success response with data payload
 */
export interface SuccessResponse<T = unknown> extends BaseResponse {
  data: T;
}

/**
 * Standard error response with error details
 */
export interface ErrorResponse extends BaseResponse {
  error: {
    code: string;
    details?: unknown;
  };
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T = unknown> extends SuccessResponse<T[]> {
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
    next_page?: string;
    prev_page?: string;
    first_page?: string;
    last_page?: string;
    links?: {
      [key: string]: string | undefined;
    };
  };
}

/**
 * Helper type to represent any valid API response
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
