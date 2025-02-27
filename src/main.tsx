import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoutesFromFiles } from "./libs/react-router/file-based-route";
import TanstackProvider from "./libs/tanstack-query/tanstack-provider.tsx";
import "./index.css";
import "./middleware.ts";

const pageFiles = import.meta.glob("./app/**/*(page|layout).tsx");
const errorFiles = import.meta.glob("./app/**/*error.tsx");
const notFoundFiles = import.meta.glob("./app/**/*404.tsx");
const loadingFiles = import.meta.glob("./app/**/*loading.tsx");

const routes = createRoutesFromFiles(pageFiles, errorFiles, notFoundFiles, loadingFiles);
const router = createBrowserRouter([routes]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanstackProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </TanstackProvider>
  </StrictMode>
);
