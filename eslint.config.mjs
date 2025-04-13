import pluginJs from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default tseslint.config(
  { ignores: ["dist", "node_modules/*", "!.prettierrc"] },
  {
    extends: [
      pluginJs.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginQuery.configs["flat/recommended"],
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.app.json", "./tsconfig.node.json"],
        projectService: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11yPlugin,
      ...prettierConfig,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...tsPlugin.configs["recommended"].rules,
      ...tsPlugin.configs["recommended-requiring-type-checking"].rules,
      ...importPlugin.configs.typescript.rules,
      "react/jsx-curly-brace-presence": "warn",
      "react/display-name": "warn",
      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": "warn",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // Built-in Node.js modules
            "external", // Third-party modules
            "internal", // Your aliases (@/*)
            "object", // Object imports
            "type", // Type imports
            "index", // Index imports
            "parent", // Imports from parent directories
            "sibling", // Imports from the same directory
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "sort-imports": "off",
      "import/first": "off",
      "import/newline-after-import": "off",
      "import/no-duplicates": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
