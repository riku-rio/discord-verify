import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["**/*.test.ts", "**/dist/**"],
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "coverage"
    },
    include: ["packages/**/*.test.ts", "tests/**/*.test.ts"],
    reporters: ["default", "junit"],
    outputFile: { junit: ".artifacts/test-results/vitest.xml" },
    testTimeout: 5000,
    hookTimeout: 30000
  }
});
