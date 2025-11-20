import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "react-vendor": ["react", "react-dom"],

          // UI components (Radix UI)
          "ui-vendor": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tooltip",
          ],

          // Data fetching and routing
          "data-vendor": [
            "@tanstack/react-query",
            "@tanstack/react-query-devtools",
            "@tanstack/react-table",
            "react-router",
          ],

          // Forms and validation
          "forms-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],

          // Utilities
          "utils-vendor": [
            "axios",
            "date-fns",
            "universal-cookie",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "cmdk",
            "react-day-picker",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
