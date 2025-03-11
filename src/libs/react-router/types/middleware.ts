/**
 * Middleware interface
 */
export interface Middleware {
  matcher?: string | RegExp | ((path: string) => boolean);
  handler: MiddlewareHandler;
}

/**
 * Middleware handler function type
 */
export type MiddlewareHandler = (
  request: Request,
  context: MiddlewareContext
) => Promise<MiddlewareResponse | void> | MiddlewareResponse | void;

/**
 * Context provided to middleware
 */
export interface MiddlewareContext {
  params: Record<string, string | undefined>;
  path: string;
  next: () => Promise<unknown>;
}

/**
 * Response from middleware
 */
export interface MiddlewareResponse {
  redirect?: string | Response;
  rewrite?: string;
  headers?: Record<string, string>;
}
