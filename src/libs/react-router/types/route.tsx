import { JSX } from "react";
import { ActionFunction, LoaderFunction, RouteObject } from "react-router";

/**
 * Represents the expected structure of a page module's exports.
 */
export interface PageModuleExports {
  default: () => JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
}

/**
 * Defines the type of page in the routing system.
 */
export interface RouteHandle {
  pageType: "page" | "layout";
}

/**
 * Extends the base RouteObject to include additional properties.
 */
export interface ExtendedRouteObject extends Omit<RouteObject, "handle" | "children"> {
  handle?: RouteHandle;
  children?: ExtendedRouteObject[];
  HydrateFallback?: React.ComponentType;
  LoadingComponent?: React.ComponentType;
}

export type PageModule = () => Promise<PageModuleExports>;
export type LoadingModule = () => Promise<{ default: () => JSX.Element }>;
export type RouteUpdater = (route: RouteObject) => RouteObject;

export const PATH_SEPARATOR = "\\";
export const DEFAULT_FALLBACK = () => <div>Loading...</div>;
