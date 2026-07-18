import { describe, expect, it } from "vitest";
import { CORE_PACKAGE_NAME } from "./index.js";

describe("core package", () => {
  it("exports its package identifier", () => expect(CORE_PACKAGE_NAME).toBe("@discord-verify/core"));
});
