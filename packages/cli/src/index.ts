export { CommandRegistry } from './cli/command-registry.js';
export type {
  CliCommand,
  CliCommandContext,
  RunCliOptions,
  TextOutput,
} from './cli/types.js';
export { getPackageVersion } from './package-metadata.js';
export { runCli } from './run-cli.js';

export const CLI_PACKAGE = 'discord-verify' as const;
