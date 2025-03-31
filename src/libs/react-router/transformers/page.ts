import { lazy } from "react";
import { createLoaderFunction, createActionFunction } from "../handlers/loader-action";
import { ExtendedRouteObject, LoadingModule, PageModule } from "../types/route";
import { getRouteSegmentsFromFilePath } from "../utils/path";
import { mergeRoutes } from "../utils/route";
import { createRoute } from "./route";

/**
 * Determines the appropriate loading component for a route.
 */
function findMatchingLoadingComponent(
  filePath: string,
  loadingFiles: Record<string, () => Promise<unknown>>
) {
  // Define loading paths in order of precedence
  const loadingPaths = [
    filePath.replace(/(page|layout)\.tsx$/, "loading.tsx"), // Local
    filePath.match(/\([^/]+\//) ? `/${filePath.match(/\([^/]+\//)?.[0]}loading.tsx` : null, // Group
    "./app/loading.tsx", // Global
  ].filter(Boolean);

  // Find the first matching loading file
  for (const path of loadingPaths) {
    if (path && loadingFiles[path]) {
      return lazy(loadingFiles[path] as LoadingModule);
    }
  }

  return undefined;
}

/**
 * Converts file-system based pages into React Router compatible routes.
 *
 * @param files - Object mapping file paths to their dynamic import functions
 * @param loadingFiles - Object mapping loading component paths to their import functions
 * @returns A complete route configuration object
 */
export function convertPagesToRoute(
  files: Record<string, () => Promise<unknown>>,
  loadingFiles: Record<string, () => Promise<unknown>> = {}
): ExtendedRouteObject {
  const routes: ExtendedRouteObject = { path: "/" };

  // Process each file to create routes
  Object.entries(files).forEach(([filePath, importer]) => {
    const segments = getRouteSegmentsFromFilePath(filePath);
    const page = lazy(importer as PageModule);
    const loadingComponent = findMatchingLoadingComponent(filePath, loadingFiles);

    const route = createRoute({
      PageComponent: page,
      LoadingComponent: loadingComponent,
      segments,
      loader: createLoaderFunction(importer),
      action: createActionFunction(importer),
    });

    mergeRoutes(routes, route);
  });

  return routes;
}
