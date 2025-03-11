import { ActionFunction, LoaderFunction } from "react-router";
import { PageModuleExports } from "../types/route";
import { withMiddleware } from "../utils/middleware";

/**
 * Creates a loader function for a route that first checks permissions via middleware.
 */
export function createLoaderFunction(importer: () => Promise<unknown>): LoaderFunction {
  return withMiddleware(async (args) => {
    const result = (await importer()) as PageModuleExports;
    return result.loader ? result.loader(args) : null;
  });
}

/**
 * Creates an action function for a route.
 */
export function createActionFunction(importer: () => Promise<unknown>): ActionFunction {
  return async (args) => {
    const result = (await importer()) as PageModuleExports;
    return result.action ? result.action(args) : null;
  };
}
