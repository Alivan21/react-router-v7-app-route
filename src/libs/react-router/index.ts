import { RouteObject } from "react-router";
import type { Middleware } from "./types/middleware";
import { addErrorElementToRoutes } from "./handlers/error";
import { add404PageToRoutesChildren } from "./handlers/not-found";
import { convertPagesToRoute } from "./transformers/page";
import { registerMiddleware } from "./utils/middleware";

/**
 * Creates a complete route configuration from file-based pages.
 *
 * @param pageFiles - Object mapping page/layout file paths to their dynamic import functions
 * @param errorFiles - Object mapping error handler file paths to their dynamic import functions
 * @param notFoundFiles - Object mapping 404 page file paths to their dynamic import functions
 * @param loadingFiles - Object mapping loading component paths to their import functions
 * @returns A complete route configuration object for React Router
 */
export function createRoutesFromFiles(
  pageFiles: Record<string, () => Promise<unknown>>,
  errorFiles: Record<string, () => Promise<unknown>> = {},
  notFoundFiles: Record<string, () => Promise<unknown>> = {},
  loadingFiles: Record<string, () => Promise<unknown>> = {}
): RouteObject {
  const routes = convertPagesToRoute(pageFiles, loadingFiles) as RouteObject;
  addErrorElementToRoutes(errorFiles, routes);
  add404PageToRoutesChildren(notFoundFiles, routes);

  return routes;
}

export { registerMiddleware };
export type { Middleware };

export * from "./utils/path";
export * from "./utils/route";

export * from "./types/route";
export * from "./types/middleware";
