import { JSX, lazy, LazyExoticComponent } from "react";
import { ActionFunction, LoaderFunction, RouteObject } from "react-router";

// ==================== TYPE DEFINITIONS ====================

/**
 * Represents the expected structure of a page module's exports.
 */
interface PageModuleExports {
  default: () => JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
}

/**
 * Defines the type of page in the routing system.
 */
interface RouteHandle {
  pageType: "page" | "layout";
}

/**
 * Extends the base RouteObject to include additional properties.
 */
interface ExtendedRouteObject extends Omit<RouteObject, "handle" | "children"> {
  handle?: RouteHandle;
  children?: ExtendedRouteObject[];
  HydrateFallback?: React.ComponentType;
}

type PageModule = () => Promise<PageModuleExports>;
type LoadingModule = () => Promise<{ default: () => JSX.Element }>;
type RouteUpdater = (route: RouteObject) => RouteObject;

const PATH_SEPARATOR = "\\";
const DEFAULT_FALLBACK = () => <div>Loading...</div>;

// ==================== MAIN FUNCTIONS ====================

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
  // Step 1: Convert page files to routes with loading components
  const routes = convertPagesToRoute(pageFiles, loadingFiles) as RouteObject;

  // Step 2: Add error boundaries to routes
  addErrorElementToRoutes(errorFiles, routes);

  // Step 3: Add 404 pages to routes
  add404PageToRoutesChildren(notFoundFiles, routes);

  return routes;
}

/**
 * Converts file-system based pages into React Router compatible routes.
 *
 * @param files - Object mapping file paths to their dynamic import functions
 * @param loadingFiles - Object mapping loading component paths to their import functions
 * @returns A complete route configuration object for React Router
 */
function convertPagesToRoute(
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

/**
 * Creates a loader function for a route that first checks permissions.
 */
function createLoaderFunction(importer: () => Promise<unknown>): LoaderFunction {
  return async (args) => {
    const result = (await importer()) as PageModuleExports;
    return result.loader ? result.loader(args) : null;
  };
}

/**
 * Creates an action function for a route.
 */
function createActionFunction(importer: () => Promise<unknown>): ActionFunction {
  return async (args) => {
    const result = (await importer()) as PageModuleExports;
    return result.action ? result.action(args) : null;
  };
}

/**
 * Determines the appropriate loading component for a route.
 */
function findMatchingLoadingComponent(
  filePath: string,
  loadingFiles: Record<string, () => Promise<unknown>>
): LazyExoticComponent<() => JSX.Element> | undefined {
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
 * Creates a new route configuration based on path segments and components.
 */
function createRoute(args: {
  segments: string[];
  PageComponent: LazyExoticComponent<() => JSX.Element>;
  LoadingComponent?: LazyExoticComponent<() => JSX.Element>;
  loader?: LoaderFunction;
  action?: ActionFunction;
  guard?: () => Promise<boolean>;
}): ExtendedRouteObject {
  const [current, ...rest] = args.segments;
  const [cleanPath, pageType] = current.split(PATH_SEPARATOR);
  const route: ExtendedRouteObject = { path: cleanPath };

  // Handle page or layout routes
  if (pageType === "page" || pageType === "layout") {
    const FallbackComponent = args.LoadingComponent || DEFAULT_FALLBACK;

    route.element = <args.PageComponent />;
    route.HydrateFallback = FallbackComponent;
    route.action = args.action;

    route.handle = { pageType: pageType };
  }

  // Handle nested routes
  if (rest.length > 0) {
    const nextSegment = rest[0].split(PATH_SEPARATOR)[0];

    // Special handling for edit/update routes
    if (isEditRoute(nextSegment)) {
      // Check if this is a dynamic parameter route
      if (isDynamicRoute(cleanPath)) {
        // For dynamic routes like :id/update, we need to create a nested structure
        route.children = route.children || [];
        route.children.push(createNestedEditRoute(nextSegment, args));
        return route;
      }

      // For static routes, create as sibling (original behavior)
      return createSiblingEditRoute(cleanPath, nextSegment, args);
    }

    // Handle as nested route
    const childRoute = createRoute({ ...args, segments: rest });
    route.children = route.children || [];

    // Dynamic parameter routes come first for proper matching
    if (isDynamicRoute(cleanPath)) {
      route.children.unshift(childRoute);
    } else {
      route.children.push(childRoute);
    }
  }

  return route;
}

/**
 * Checks if a route segment is an edit/update route.
 */
function isEditRoute(segment: string): boolean {
  return segment === "update" || segment === "edit";
}

/**
 * Checks if a route is a dynamic parameter route.
 */
function isDynamicRoute(path: string): boolean {
  return path.startsWith(":");
}

/**
 * Creates a nested edit/update route for a dynamic parameter
 */
function createNestedEditRoute(
  editSegment: string,
  args: {
    PageComponent: LazyExoticComponent<() => JSX.Element>;
    LoadingComponent?: LazyExoticComponent<() => JSX.Element>;
    loader?: LoaderFunction;
    action?: ActionFunction;
    guard?: () => Promise<boolean>;
  }
): ExtendedRouteObject {
  const FallbackComponent = args.LoadingComponent || DEFAULT_FALLBACK;

  return {
    path: editSegment,
    element: <args.PageComponent />,
    HydrateFallback: FallbackComponent,
    action: args.action,
    loader: args.loader,
    handle: { pageType: "page" },
  };
}

/**
 * Creates an edit/update route as a sibling (for non-dynamic routes)
 */
function createSiblingEditRoute(
  cleanPath: string,
  editSegment: string,
  args: {
    PageComponent: LazyExoticComponent<() => JSX.Element>;
    LoadingComponent?: LazyExoticComponent<() => JSX.Element>;
    loader?: LoaderFunction;
    action?: ActionFunction;
    guard?: () => Promise<boolean>;
  }
): ExtendedRouteObject {
  const FallbackComponent = args.LoadingComponent || DEFAULT_FALLBACK;

  return {
    path: `${cleanPath}/${editSegment}`,
    element: <args.PageComponent />,
    HydrateFallback: FallbackComponent,
    action: args.action,
    loader: args.loader,
    handle: { pageType: "page" },
  };
}

/**
 * Merges two route configurations while maintaining proper hierarchy.
 */
function mergeRoutes(
  target: ExtendedRouteObject,
  source: ExtendedRouteObject
): ExtendedRouteObject {
  if (target.path !== source.path) {
    throw new Error(`Paths do not match: "${target.path}" and "${source.path}"`);
  }

  // Initialize children array if needed
  target.children = target.children || [];

  // Handle layouts first (they take precedence)
  if (source.handle?.pageType === "layout") {
    return handleLayoutMerge(target, source);
  }

  // Handle page route
  if (source.handle?.pageType === "page") {
    return handlePageMerge(target, source);
  }

  // Handle nested routes
  if (source.children && source.children.length > 0) {
    mergeChildRoutes(target, source);
  }

  return target;
}

/**
 * Handles the merging of a layout route.
 */
function handleLayoutMerge(
  target: ExtendedRouteObject,
  source: ExtendedRouteObject
): ExtendedRouteObject {
  // If target has no element, use the source layout
  if (!target.element) {
    Object.assign(target, {
      element: source.element,
      HydrateFallback: source.HydrateFallback,
      action: source.action,
      loader: source.loader,
      handle: source.handle,
      errorElement: source.errorElement,
    });
  }
  // If target is a page, convert it to an index route under the layout
  else if (target.handle?.pageType === "page") {
    target = swapTargetRouteAsIndexRouteAndUpdateWithRoute(target, source);
  }

  return target;
}

/**
 * Handles the merging of a page route.
 */
function handlePageMerge(
  target: ExtendedRouteObject,
  source: ExtendedRouteObject
): ExtendedRouteObject {
  // Ensure target.children exists
  if (!target.children) {
    target.children = [];
  }

  // If there's no index route yet, add this page as index
  if (!target.children.some((child) => child.index)) {
    target.children.unshift({
      index: true,
      element: source.element,
      HydrateFallback: source.HydrateFallback,
      action: source.action,
      loader: source.loader,
      handle: source.handle,
    });
  }
  // If target is a layout, add page as index route
  else if (target.handle?.pageType === "layout") {
    target = addRouteAsIndexRouteForTargetRoute(target, source);
  }

  return target;
}

/**
 * Merges child routes from source to target.
 */
function mergeChildRoutes(target: ExtendedRouteObject, source: ExtendedRouteObject): void {
  if (!source.children) return;

  // Ensure target.children exists
  if (!target.children) {
    target.children = [];
  }

  source.children.forEach((sourceChild) => {
    const matchingChild = target.children!.find(
      (targetChild) => targetChild.path === sourceChild.path
    );

    if (matchingChild) {
      mergeRoutes(matchingChild, sourceChild);
    } else {
      target.children!.push(sourceChild);
    }
  });
}

/**
 * Takes a page route and converts it into an index route under a layout route.
 */
function swapTargetRouteAsIndexRouteAndUpdateWithRoute(
  target: ExtendedRouteObject,
  layout: ExtendedRouteObject
): ExtendedRouteObject {
  // Save current route as index route
  target.children = target.children || [];
  target.children.push({
    index: true,
    element: target.element,
    HydrateFallback: target.HydrateFallback,
    action: target.action,
    loader: target.loader,
    handle: target.handle,
    errorElement: target.errorElement,
  });

  // Update target with layout properties
  Object.assign(target, {
    element: layout.element,
    HydrateFallback: layout.HydrateFallback,
    action: layout.action,
    loader: layout.loader,
    handle: layout.handle,
    errorElement: layout.errorElement,
  });

  return target;
}

/**
 * Adds a route as an index route under a target layout route.
 */
function addRouteAsIndexRouteForTargetRoute(
  target: ExtendedRouteObject,
  page: ExtendedRouteObject
): ExtendedRouteObject {
  target.children = target.children || [];
  target.children.push({
    index: true,
    element: page.element,
    HydrateFallback: page.HydrateFallback,
    action: page.action,
    loader: page.loader,
    handle: page.handle,
    errorElement: page.errorElement,
  });

  return target;
}

/**
 * Processes a file path to generate route segments, handling various routing patterns.
 *
 * @param filePath - The file path to process
 * @param transformer - Optional function to transform segment names
 * @returns Array of processed route segments
 */
export function getRouteSegmentsFromFilePath(
  filePath: string,
  transformer?: (segment: string, prevSegment: string) => string
): string[] {
  const defaultTransformer = (segment: string, prevSegment: string): string =>
    `${prevSegment}${PATH_SEPARATOR}${segment.split(".")[0]}`;

  const actualTransformer = transformer || defaultTransformer;

  const segments = filePath
    .replace("/app", "")
    .split("/")
    .filter((segment) => !segment.startsWith("(index)") && !segment.startsWith("_"))
    .map((segment) => {
      if (segment.startsWith(".")) return "/";
      if (segment.startsWith("(")) return segment.replace(/[()]/g, "") + "?";
      if (segment.startsWith("[...")) return "*";
      if (segment.startsWith("[")) return segment.replace("[", ":").replace("]", "");
      return segment;
    });

  return buildSegmentPath(segments[0], segments, actualTransformer);
}

/**
 * Builds segment path using a transformer function.
 */
function buildSegmentPath(
  firstSegment: string,
  segments: string[],
  transformer: (seg: string, prev: string) => string,
  entries: string[] = [],
  index = 0
): string[] {
  if (index >= segments.length) {
    return entries;
  }

  const segment = segments[index];
  const isLastSegment = index === segments.length - 1;

  if (isLastSegment) {
    const lastEntry = entries.pop() || "";
    entries.push(transformer(segment, lastEntry));
    return entries;
  }

  const nextIndex = index + 1;

  if (!segment.startsWith(":")) {
    entries.push(segment);
  } else {
    const lastEntry = entries.pop() || "";
    entries.push(`${lastEntry}/${segment}`);
  }

  return buildSegmentPath(firstSegment, segments, transformer, entries, nextIndex);
}

/**
 * Adds error boundaries to routes based on error component files.
 */
export function addErrorElementToRoutes(
  errorFiles: Record<string, () => Promise<unknown>>,
  routes: RouteObject
): void {
  Object.entries(errorFiles).forEach(([filePath, importer]) => {
    const segments = getRouteSegmentsFromFilePath(
      filePath,
      (_segment: string, prev: string) => prev
    );
    const ErrorBoundary = lazy(importer as () => Promise<{ default: () => JSX.Element }>);

    setRoute(segments, routes, (route) => {
      route.errorElement = <ErrorBoundary />;
      return route;
    });
  });
}

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

/**
 * Adds a 404 page to a specific route.
 */
function add404ToRoute(route: RouteObject, notFoundElement: JSX.Element): RouteObject {
  // Route has children - add 404 as catch-all
  if (route.children?.length) {
    set404NonPage(route, notFoundElement);
    route.children.push({ path: "*", element: notFoundElement });
    return route;
  }

  // No children - convert to layout and add index + 404
  const tempRoute = { ...route };
  route.children = [];

  // Add current route as index
  route.children.push({
    index: true,
    element: tempRoute.element,
    action: tempRoute.action,
    loader: tempRoute.loader,
  });

  // Add 404 as catch-all
  route.children.push({ path: "*", element: notFoundElement });

  // Remove properties from parent route
  delete route.element;
  delete route.action;
  delete route.loader;

  return route;
}

/**
 * Sets 404 pages for routes without index routes.
 */
function set404NonPage(routes: RouteObject, notFoundElement: JSX.Element): void {
  // Check if this is a candidate for adding a 404 index
  if (
    routes.path &&
    routes.children &&
    routes.children.length > 0 &&
    !routes.path.includes("?") &&
    !routes.path.includes("/") &&
    !routes.children.some((child) => child.index)
  ) {
    routes.children.push({
      index: true,
      element: notFoundElement,
    });
  }

  // Recursively process all children
  if (routes.children) {
    routes.children.forEach((_route) => set404NonPage(_route, notFoundElement));
  }
}

/**
 * Recursively traverses and updates routes based on segment paths.
 */
function setRoute(segments: string[], route: RouteObject, updater: RouteUpdater): void {
  let currentRoute = route;

  for (let i = 0; i < segments.length; i++) {
    const isLastSegment = i === segments.length - 1;

    if (isLastSegment) {
      updater(currentRoute);
      return;
    }

    const nextSegment = segments[i + 1];

    // Make sure children exists
    if (!currentRoute.children) {
      throw new Error(
        `Route with path ${currentRoute.path} has no children, but expected to find ${nextSegment}`
      );
    }

    const childIndex = currentRoute.children.findIndex((child) => child.path === nextSegment);

    if (childIndex === -1) {
      throw new Error(
        `Segment ${nextSegment} does not exist among the children of route with path ${currentRoute.path}`
      );
    }

    currentRoute = currentRoute.children[childIndex];
  }
}
