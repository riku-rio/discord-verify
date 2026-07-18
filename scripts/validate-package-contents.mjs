import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const directories = (await readdir("packages", { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const directory of directories) {
  const cwd = join(process.cwd(), "packages", directory);
  const result = spawnSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32"
  });
  if (result.status !== 0) throw new Error(`npm pack failed for ${directory}: ${result.stderr}`);
  const report = JSON.parse(result.stdout)[0];
  const paths = report.files.map((file) => file.path.replaceAll("\\", "/"));
  const forbidden = paths.filter((path) => {
    if (directory === "adapter-discordpy" && path.startsWith("python/src/")) return false;
    return /(^|\/)(src|test|tests|coverage|node_modules|__pycache__)(\/|$)/u.test(path) || path.endsWith(".pyc");
  });
  if (forbidden.length > 0) throw new Error(`${directory} package includes forbidden paths: ${forbidden.join(", ")}`);
  if (!paths.some((path) => path.endsWith("dist/index.js"))) throw new Error(`${directory} package lacks dist/index.js`);
  if (directory === "adapter-discordpy") {
    const bridge = "python/src/discord_verify_adapter/__init__.py";
    if (!paths.includes(bridge)) throw new Error(`Python bridge is missing: ${bridge}`);
  } else if (paths.some((path) => path.startsWith("python/"))) {
    throw new Error(`${directory} unexpectedly includes Python files`);
  }
}
console.log(`Validated publish contents for ${directories.length} packages.`);
