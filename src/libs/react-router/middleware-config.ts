// libs/react-router/middleware.ts
import { LoaderFunction, redirect } from "react-router";

// Middleware interface
export interface Middleware {
  matcher?: string | RegExp | ((path: string) => boolean);
  handler: MiddlewareHandler;
}

// Middleware handler function type
export type MiddlewareHandler = (
  request: Request,
  context: MiddlewareContext
) => Promise<MiddlewareResponse | void> | MiddlewareResponse | void;

// Context provided to middleware
export interface MiddlewareContext {
  params: Record<string, string | undefined>;
  path: string;
  next: () => Promise<unknown>;
}

// Response from middleware
export interface MiddlewareResponse {
  redirect?: string | Response;
  rewrite?: string;
  headers?: Record<string, string>;
}

// Store registered middlewares
const middlewares: Middleware[] = [];

/**
 * Register a middleware
 * @param middleware The middleware to register
 */
export function registerMiddleware(middleware: Middleware): void {
  middlewares.push(middleware);
}

/**
 * Check if a middleware should run for a specific path
 */
function shouldRunMiddleware(middleware: Middleware, path: string): boolean {
  if (!middleware.matcher) return true;

  if (typeof middleware.matcher === "string") {
    // String matchers can use * as wildcards
    const pattern = middleware.matcher.replace(/\*/g, ".*");
    return new RegExp(`^${pattern}$`).test(path);
  }

  if (middleware.matcher instanceof RegExp) {
    return middleware.matcher.test(path);
  }

  if (typeof middleware.matcher === "function") {
    return middleware.matcher(path);
  }

  return false;
}

/**
 * Apply middleware to a loader function
 * @param originalLoader The original loader function
 * @returns A new loader function wrapped with middleware
 */
export function withMiddleware(originalLoader?: LoaderFunction): LoaderFunction {
  return async (args) => {
    const { request, params } = args;
    const url = new URL(request.url);
    const path = url.pathname;

    // Find applicable middlewares
    const applicableMiddlewares = middlewares.filter((middleware) =>
      shouldRunMiddleware(middleware, path)
    );

    if (applicableMiddlewares.length === 0) {
      // No middleware to run, execute original loader
      return originalLoader ? originalLoader(args) : null;
    }

    // Chain the middlewares
    let currentIndex = 0;

    const executeMiddlewareChain = async (): Promise<unknown> => {
      if (currentIndex >= applicableMiddlewares.length) {
        // All middlewares executed, run the original loader
        return originalLoader ? originalLoader(args) : null;
      }

      const middleware = applicableMiddlewares[currentIndex];
      currentIndex++;

      const context: MiddlewareContext = {
        params,
        path,
        next: executeMiddlewareChain,
      };

      const result = await middleware.handler(request, context);

      if (!result) {
        // Middleware didn't return anything, continue chain
        return executeMiddlewareChain();
      }

      if (result.redirect) {
        // Handle redirect
        if (typeof result.redirect === "string") {
          return redirect(result.redirect);
        }
        return result.redirect;
      }

      if (result.rewrite) {
        // Handle path rewrite - would need to create a new request and update args
        const newUrl = new URL(result.rewrite, url.origin);
        const newRequest = new Request(newUrl, request);
        return originalLoader ? originalLoader({ ...args, request: newRequest }) : null;
      }

      if (result.headers) {
        // Headers would be applied when we're handling a response
        // For now, we just continue the chain
        return executeMiddlewareChain();
      }

      // Continue with the middleware chain
      return executeMiddlewareChain();
    };

    return executeMiddlewareChain();
  };
}
