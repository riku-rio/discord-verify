import { describe, expect, it } from "vitest";
import { ADAPTER_DISCORDPY_PACKAGE_NAME } from "./index.js";

describe("discord.py adapter package", () => {
  it("exports its package identifier", () => expect(ADAPTER_DISCORDPY_PACKAGE_NAME).toBe("@discord-verify/adapter-discordpy"));
});
