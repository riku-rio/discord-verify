import { describe, expect, it } from "vitest";

const syntheticSecret = "discord-verify-test-token-never-real";

describe("synthetic secret fixture", () => {
  it("is explicitly synthetic", () => expect(syntheticSecret).toContain("never-real"));
});
