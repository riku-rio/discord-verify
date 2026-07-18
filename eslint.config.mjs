import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/coverage/**", "**/.venv/**", "**/.artifacts/**", "docs/PRD.md", "docs/TASKS.md"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.ts"],
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "no-restricted-imports": ["error", { "patterns": [{ "group": ["**/packages/*/src/**"], "message": "Import workspace packages through public exports." }] }],
      "sort-imports": ["error", { "allowSeparatedGroups": true, "ignoreCase": true, "ignoreDeclarationSort": true, "memberSyntaxSortOrder": ["none", "all", "multiple", "single"] }]
    }
  },
  {
    files: ["**/*.test.ts", "tests/**/*.ts", "vitest.config.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off"
    }
  }
);
