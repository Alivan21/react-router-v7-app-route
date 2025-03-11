import { JSX } from "react";
import { RouteObject } from "react-router";
import { ExtendedRouteObject, RouteUpdater } from "../types/route";

/**
 * Recursively traverses and updates routes based on segment paths.
 */
export function setRoute(segments: string[], route: RouteObject, updater: RouteUpdater): void {
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

/**
 * Merges two route configurations while maintaining proper hierarchy.
 */
export function mergeRoutes(
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
export function handleLayoutMerge(
  target: ExtendedRouteObject,
  source: ExtendedRouteObject
): ExtendedRouteObject {
  // If target has no element, use the source layout
  if (!target.element) {
    Object.assign(target, {
      element: source.element,
      HydrateFallback: source.HydrateFallback,
      LoadingComponent: source.LoadingComponent,
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
 * Takes a page route and converts it into an index route under a layout route.
 */
export function swapTargetRouteAsIndexRouteAndUpdateWithRoute(
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
 * Handles the merging of a page route.
 */
export function handlePageMerge(
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
      LoadingComponent: source.LoadingComponent,
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
 * Adds a route as an index route under a target layout route.
 */
export function addRouteAsIndexRouteForTargetRoute(
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
 * Merges child routes from source to target.
 */
export function mergeChildRoutes(target: ExtendedRouteObject, source: ExtendedRouteObject): void {
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
 * Adds a 404 page to a specific route.
 */
export function add404ToRoute(route: RouteObject, notFoundElement: JSX.Element): RouteObject {
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
export function set404NonPage(routes: RouteObject, notFoundElement: JSX.Element): void {
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
