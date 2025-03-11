import { SessionAuthCookies } from "./libs/cookies";
import { registerMiddleware } from "./libs/react-router";
import { decodeJwt } from "./utils/jwt";

registerMiddleware({
  // Index route handling middleware
  matcher: "^/$",
  handler: () => {
    const token = SessionAuthCookies.get();
    const isAuthenticated = token && decodeJwt(token) !== null;

    if (isAuthenticated) {
      return {
        redirect: "/dashboard",
      };
    } else {
      return {
        redirect: "/login",
      };
    }
  },
});

registerMiddleware({
  // Match all routes
  matcher: ".*",
  handler: (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const token = SessionAuthCookies.get();
    const isAuthenticated = token && decodeJwt(token) !== null;

    const publicRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
    ];

    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!isPublicRoute && !isAuthenticated) {
      return {
        redirect: `/login?redirect=${encodeURIComponent(pathname)}`,
      };
    }

    if (isPublicRoute && isAuthenticated) {
      return {
        redirect: "/dashboard",
      };
    }

    return;
  },
});
