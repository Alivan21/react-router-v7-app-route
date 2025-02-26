import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router";
import {
  add404PageToRoutesChildren,
  addErrorElementToRoutes,
  convertPagesToRoute,
} from "./libs/react-router/file-based-route";
import "./index.css";

const files = import.meta.glob("./app/**/*(page|layout).tsx");
const errorFiles = import.meta.glob("./app/**/*error.tsx");
const notFoundFiles = import.meta.glob("./app/**/*404.tsx");
const loadingFiles = import.meta.glob("./app/**/*loading.tsx");

const routes = convertPagesToRoute(files, loadingFiles) as RouteObject;
addErrorElementToRoutes(errorFiles, routes);
add404PageToRoutesChildren(notFoundFiles, routes);

const router = createBrowserRouter([routes]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
