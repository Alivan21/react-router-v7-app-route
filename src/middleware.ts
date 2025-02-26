import { registerMiddleware } from "./libs/react-router/middleware-config";

registerMiddleware({
  // Using a simple path pattern that correctly matches the root path (/)
  matcher: ".*",
  handler: (request, context) => {
    console.log("🔍 FIRST DEBUG MIDDLEWARE RUNNING");
    console.log("Request:", request);
    console.log("Context:", context);
    console.log("🔍 MIDDLEWARE FINISHED");
  },
});

// registerMiddleware({
//   matcher: "/(.*)",
//   handler: async (request, context) => {
//     // Get auth token from headers or cookies
//     const url = new URL(request.url);
//     const token = request.headers.get("Authorization") || getCookie("auth-token");

//     // Protected routes pattern (routes that require authentication)
//     const isProtectedRoute = /^\/dashboard|\/admin|\/user/.test(context.path);

//     if (isProtectedRoute && !token) {
//       // Redirect to login if accessing protected route without token
//       return {
//         redirect: `/?redirect=${encodeURIComponent(url.pathname + url.search)}`,
//       };
//     }

//     // Continue to the next middleware or the actual route
//     await context.next();
//     return;
//   },
// });
