export { CommandRegistry } from './cli/command-registry.js';
export { CliUsageError } from './cli/errors.js';
export { parseCliInput } from './cli/global-options.js';
export type {
  CliCommand,
  CliCommandContext,
  GlobalCliOptions,
  GlobalOptionValidator,
  ParsedCliInput,
  ResolvedCliCommand,
  RunCliOptions,
  TextOutput,
} from './cli/types.js';
export { getPackageVersion } from './package-metadata.js';
export { runCli } from './run-cli.js';

export const CLI_PACKAGE = 'discord-verify' as const;
