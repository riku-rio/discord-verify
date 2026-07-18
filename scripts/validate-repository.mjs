import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const expected = new Set(["cli", "core", "adapter-protocol", "adapter-discordjs", "adapter-discordpy", "shared", "test-kit"]);
const adapters = new Set(["adapter-discordjs", "adapter-discordpy"]);
const entries = await readdir("packages", { withFileTypes: true });
const actual = new Set(entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));

for (const name of expected) if (!actual.has(name)) throw new Error(`Missing workspace package: ${name}`);
for (const name of actual) if (!expected.has(name)) throw new Error(`Undocumented workspace package: ${name}`);

const manifests = new Map();
for (const directory of expected) {
  const manifest = JSON.parse(await readFile(join("packages", directory, "package.json"), "utf8"));
  manifests.set(manifest.name, { directory, manifest });
  for (const script of ["build", "clean", "typecheck", "test"]) {
    if (typeof manifest.scripts?.[script] !== "string") throw new Error(`${manifest.name} is missing ${script}`);
  }
  const dependencies = Object.keys(manifest.dependencies ?? {});
  if (!adapters.has(directory) && dependencies.some((name) => name === "discord.js" || name.startsWith("discord.py"))) {
    throw new Error(`${manifest.name} contains framework-specific dependencies`);
  }
}

const graph = new Map();
for (const [name, value] of manifests) {
  graph.set(name, Object.keys(value.manifest.dependencies ?? {}).filter((dependency) => manifests.has(dependency)));
}
const visited = new Set();
const active = new Set();
function visit(name) {
  if (active.has(name)) throw new Error(`Workspace dependency cycle detected at ${name}`);
  if (visited.has(name)) return;
  active.add(name);
  for (const dependency of graph.get(name) ?? []) visit(dependency);
  active.delete(name);
  visited.add(name);
}
for (const name of graph.keys()) visit(name);
console.log(`Validated ${manifests.size} workspace packages and architecture boundaries.`);
