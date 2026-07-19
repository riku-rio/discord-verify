import { CliUsageError } from './cli/errors.js';
import { parseCliInput } from './cli/global-options.js';
import type { CliCommandContext, RunCliOptions, TextOutput } from './cli/types.js';
import { writeHelp } from './commands/help.js';
import { registerCommands } from './commands/register-commands.js';
import { getPackageVersion } from './package-metadata.js';

export async function runCli(options: RunCliOptions): Promise<number> {
  const jsonRequested = options.argv.includes('--json');

  try {
    const parsed = parseCliInput(options.argv);
    const registry = registerCommands();
    const humanOutput = parsed.globalOptions.json ? options.stderr : options.stdout;

    if (parsed.commandName === undefined || parsed.helpRequested) {
      writeHelp(registry, humanOutput);
      return 0;
    }

    if (parsed.versionRequested) {
      humanOutput.write(`${getPackageVersion()}\n`);
      return 0;
    }

    const resolved = registry.resolve([parsed.commandName, ...parsed.commandArgs]);

    if (resolved === undefined) {
      throw new CliUsageError(`Unknown command: ${parsed.commandName}`);
    }

    const context: CliCommandContext = {
      args: resolved.args,
      commandPath: resolved.commandPath,
      globalOptions: parsed.globalOptions,
      stdout: parsed.globalOptions.json ? createBlockedStdout() : options.stdout,
      stderr: options.stderr,
    };

    await resolved.command.validate?.(context);

    if (resolved.command.execute === undefined) {
      throw new CliUsageError(`Missing subcommand for: ${resolved.commandPath.join(' ')}`);
    }

    return await resolved.command.execute(context);
  } catch (error) {
    if (error instanceof CliUsageError) {
      options.stderr.write(`${error.message}\n`);
      options.stderr.write("Run 'discord-verify --help' for usage.\n");
      return 1;
    }

    if (jsonRequested) {
      options.stderr.write('Unexpected CLI parser failure.\n');
      return 1;
    }

    throw error;
  }
}

function createBlockedStdout(): TextOutput {
  return {
    write() {
      throw new Error('Commands must not write human output to stdout in JSON mode.');
    },
  };
}
