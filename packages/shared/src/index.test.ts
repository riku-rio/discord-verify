import { describe, expect, it } from "vitest";
import { SHARED_PACKAGE_NAME } from "./index.js";

describe("shared package", () => {
  it("exports its package identifier", () => expect(SHARED_PACKAGE_NAME).toBe("@discord-verify/shared"));
});
