import { describe, expect, it } from "vitest";
import { CLI_PACKAGE_NAME } from "./index.js";

describe("cli package", () => {
  it("exports its package identifier", () => expect(CLI_PACKAGE_NAME).toBe("discord-verify"));
});
