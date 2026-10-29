import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const PURE = "src/lib is pure: pass it in as an argument from src/server or the route instead.";

export default defineConfig([
  globalIgnores([
    "worktrees/**",
    "dist/**",
    "build/**",
    "coverage/**",
    ".wrangler/**",
    "worker-configuration.d.ts",
    "playwright-report/**",
    "test-results/**",
    "reports/**",
    ".stryker-tmp/**",
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  // The lib engine: pure functions only. No I/O, environment, clock, randomness or framework imports.
  {
    files: ["src/lib/**/*.{ts,tsx}"],
    ignores: ["src/lib/**/*.test.ts"],
    languageOptions: { globals: {} },
    rules: {
      "no-restricted-globals": [
        "error",
        ...[
          "process",
          "fetch",
          "window",
          "document",
          "localStorage",
          "sessionStorage",
          "navigator",
          "caches",
        ].map((name) => ({ name, message: `${name}: ${PURE}` })),
      ],
      "no-restricted-properties": [
        "error",
        { object: "Date", property: "now", message: `The clock: ${PURE}` },
        { object: "Math", property: "random", message: `Randomness: ${PURE}` },
        { object: "crypto", property: "randomUUID", message: `Randomness: ${PURE}` },
        { object: "crypto", property: "getRandomValues", message: `Randomness: ${PURE}` },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message: `new Date() reads the clock: ${PURE}`,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "node:*",
                "fs",
                "fs/*",
                "path",
                "child_process",
                "os",
                "http",
                "https",
                "net",
              ],
              message: `I/O: ${PURE}`,
            },
            {
              group: ["cloudflare:*", "wrangler", "@cloudflare/*"],
              message: `Cloudflare runtime: ${PURE}`,
            },
            {
              group: [
                "react",
                "react-dom",
                "react-dom/*",
                "react-router",
                "@react-router/*",
                "@tanstack/*",
              ],
              message: `Framework code: ${PURE}`,
            },
            {
              group: ["@supabase/*", "drizzle-orm", "drizzle-orm/*", "resend", "stripe"],
              message: `Services: ${PURE}`,
            },
            {
              group: ["**/server/**", "**/routes/**", "**/components/**", "**/app/**"],
              message: `lib can't import app layers: ${PURE}`,
            },
          ],
        },
      ],
    },
  },
]);
