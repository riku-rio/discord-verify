import { rm } from "node:fs/promises";
import { join } from "node:path";

const roots = ["coverage", ".artifacts"];
const packages = ["cli", "core", "adapter-protocol", "adapter-discordjs", "adapter-discordpy", "shared", "test-kit"];

await Promise.all([
  ...roots.map((path) => rm(path, { force: true, recursive: true })),
  ...packages.map((name) => rm(join("packages", name, "dist"), { force: true, recursive: true }))
]);
