import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: { provider: 'v8', reporter: ['text', 'json', 'html'], reportsDirectory: 'coverage' },
    testTimeout: 10_000,
    hookTimeout: 10_000,
    include: ['packages/**/*.test.ts', 'tests/**/*.test.ts']
  }
});
