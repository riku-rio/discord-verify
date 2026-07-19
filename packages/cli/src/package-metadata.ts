import { readFileSync } from 'node:fs';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getPackageVersion(): string {
  const packageJsonUrl = new URL('../package.json', import.meta.url);
  const packageJson = JSON.parse(readFileSync(packageJsonUrl, 'utf8')) as unknown;

  if (!isRecord(packageJson) || typeof packageJson.version !== 'string') {
    throw new Error('The discord-verify package version is missing or invalid.');
  }

  return packageJson.version;
}
