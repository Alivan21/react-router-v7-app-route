import { lazy, JSX } from "react";
import { RouteObject } from "react-router";
import { getRouteSegmentsFromFilePath } from "../utils/path";
import { setRoute, add404ToRoute } from "../utils/route";

/**
 * Adds 404 (Not Found) pages to route children.
 */
export function add404PageToRoutesChildren(
  notFoundFiles: Record<string, () => Promise<unknown>>,
  routes: RouteObject
): void {
  Object.entries(notFoundFiles).forEach(([filePath, importer]) => {
    const segments = getRouteSegmentsFromFilePath(
      filePath,
      (_segment: string, prev: string) => prev
    );
    const NotFound = lazy(importer as () => Promise<{ default: () => JSX.Element }>);

    setRoute(segments, routes, (route) => {
      return add404ToRoute(route, <NotFound />);
    });
  });
}
