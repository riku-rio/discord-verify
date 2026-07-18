import { describe, expect, it } from "vitest";
import { ADAPTER_DISCORDJS_PACKAGE_NAME } from "./index.js";

describe("discord.js adapter package", () => {
  it("exports its package identifier", () => expect(ADAPTER_DISCORDJS_PACKAGE_NAME).toBe("@discord-verify/adapter-discordjs"));
});
