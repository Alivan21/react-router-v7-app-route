/**
 * Base API response type that all response types should extend
 */
export type TBaseResponse = {
  message: string;
  timestamp: string;
};

/**
 * Standard success response with data payload
 */
export type TResponseData<T = unknown> = TBaseResponse & {
  data: T;
};

/**
 * Standard error response with error details
 */
export type TErrorResponse = TBaseResponse & {
  error: {
    code: string;
    details?: unknown;
  };
};

export type TMeta = {
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

/**
 * Paginated response for list endpoints
 */
export type TResponsePaginated<T = unknown> = TResponseData<T[]> & {
  meta?: TMeta;
};
