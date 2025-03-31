import { LazyExoticComponent, JSX } from "react";
import { ActionFunction, LoaderFunction } from "react-router";
import { ExtendedRouteObject, PATH_SEPARATOR, DEFAULT_FALLBACK } from "../types/route";
import { isDynamicRoute } from "../utils/path";

/**
 * Creates a new route configuration based on path segments and components.
 */
export function createRoute(args: {
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
    route.LoadingComponent = FallbackComponent;

    route.action = args.action;
    route.loader = args.loader;

    route.handle = { pageType: pageType };
  }

  if (rest.length > 0) {
    handleNestedRoutes(route, rest, args);
  }

  return route;
}

/**
 * Handle nested route creation
 */
function handleNestedRoutes(
  route: ExtendedRouteObject,
  rest: string[],
  args: {
    segments: string[];
    PageComponent: LazyExoticComponent<() => JSX.Element>;
    LoadingComponent?: LazyExoticComponent<() => JSX.Element>;
    loader?: LoaderFunction;
    action?: ActionFunction;
    guard?: () => Promise<boolean>;
  }
): void {
  const nextSegment = rest[0].split(PATH_SEPARATOR)[0];
  const cleanPath = route.path || "";

  if (isDynamicRoute(cleanPath)) {
    route.children = route.children || [];
    route.children.push(createNestedRoute(nextSegment, args));
    return;
  }

  const childRoute = createRoute({ ...args, segments: rest });
  route.children = route.children || [];

  route.children.push(childRoute);
}

/**
 * Creates a nested edit/update route for a dynamic parameter
 */
export function createNestedRoute(
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
