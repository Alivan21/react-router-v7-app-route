/**
 * Base API response type that all response types should extend
 */
export type BaseResponse = {
  message: string;
  timestamp: string;
};

/**
 * Standard success response with data payload
 */
export type SuccessResponse<T = unknown> = BaseResponse & {
  data: T;
};

/**
 * Standard error response with error details
 */
export type ErrorResponse = BaseResponse & {
  error: {
    code: string;
    details?: unknown;
  };
};

/**
 * Paginated response for list endpoints
 */
export type PaginatedResponse<T = unknown> = SuccessResponse<T[]> & {
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
};

/**
 * Helper type to represent any valid API response
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
