import globals from "globals";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginJest from "eslint-plugin-jest";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginMarkdown from "eslint-plugin-markdown";
import eslintPluginPromise from "eslint-plugin-promise";
import eslintPluginN from "eslint-plugin-n";
import typescriptParser from "@typescript-eslint/parser";
import eslintPluginTypeScript from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["build/**", "coverage/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      jest: eslintPluginJest,
      import: eslintPluginImport,
      markdown: eslintPluginMarkdown,
      promise: eslintPluginPromise,
      eslintn: eslintPluginN,
      "@typescript-eslint": eslintPluginTypeScript,
    },
    rules: {
      // Prittier rules
      "prettier/prettier": [
        "error",
        {
          semi: false,
          tabWidth: 2,
          printWidth: 120,
          singleQuote: true,
          bracketSpacing: true,
          trailingComma: "all",
          arrowParens: "always",
        },
      ],

      // General rules
      // 'no-console': 'warn',
      "no-debugger": "error",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Imports rules
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal"],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
        },
      ],

      // Jest rules
      "jest/no-disabled-tests": "off",
      "jest/no-focused-tests": "warn",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",

      // Promises rules
      "promise/always-return": "warn",
      "promise/no-return-wrap": "error",
      "promise/catch-or-return": "error",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
];
