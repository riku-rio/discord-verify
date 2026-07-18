import { describe, expect, it } from "vitest";
import { ADAPTER_PROTOCOL_PACKAGE_NAME, ADAPTER_PROTOCOL_SCHEMA_VERSION } from "./index.js";

describe("adapter protocol package", () => {
  it("exports versioned metadata", () => {
    expect(ADAPTER_PROTOCOL_PACKAGE_NAME).toBe("@discord-verify/adapter-protocol");
    expect(ADAPTER_PROTOCOL_SCHEMA_VERSION).toBe("0.1");
  });
});
