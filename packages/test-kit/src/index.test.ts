import { access } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { TEST_KIT_PACKAGE_NAME, withTemporaryDirectory } from "./index.js";

describe("test kit", () => {
  it("exports its package identifier", () => expect(TEST_KIT_PACKAGE_NAME).toBe("@discord-verify/test-kit"));
  it("creates and removes temporary directories", async () => {
    let path = "";
    await withTemporaryDirectory(async (directory) => {
      path = directory;
      await expect(access(directory)).resolves.toBeUndefined();
    });
    await expect(access(path)).rejects.toBeDefined();
  });
});
