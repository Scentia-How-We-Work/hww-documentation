import { defineConfig } from "vitest/config";

// Unit tests cover the pure lib engine (src/lib) only. Coverage thresholds make lib tests mandatory.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/lib/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts"],
      exclude: ["src/lib/**/*.test.ts", "src/lib/**/types.ts"],
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 85 },
    },
  },
});
