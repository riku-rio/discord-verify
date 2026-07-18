import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: 'coverage',
      include: ['packages/*/src/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts', '**/*.d.ts', '**/dist/**', '**/generated/**'],
    },
    testTimeout: 10_000,
    hookTimeout: 10_000,
    include: ['packages/**/*.test.ts', 'tests/**/*.test.ts'],
  },
});
