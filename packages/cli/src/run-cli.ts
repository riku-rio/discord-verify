import type { RunCliOptions } from './cli/types.js';
import { writeHelp } from './commands/help.js';
import { registerCommands } from './commands/register-commands.js';
import { getPackageVersion } from './package-metadata.js';

const HELP_FLAGS = new Set(['-h', '--help']);
const VERSION_FLAGS = new Set(['-V', '--version']);

export async function runCli(options: RunCliOptions): Promise<number> {
  const registry = registerCommands();
  const [commandName, ...args] = options.argv;

  if (commandName === undefined || HELP_FLAGS.has(commandName)) {
    writeHelp(registry, options.stdout);
    return 0;
  }

  if (VERSION_FLAGS.has(commandName)) {
    options.stdout.write(`${getPackageVersion()}\n`);
    return 0;
  }

  const command = registry.get(commandName);

  if (command === undefined) {
    options.stderr.write(`Unknown command: ${commandName}\n`);
    options.stderr.write("Run 'discord-verify --help' for usage.\n");
    return 1;
  }

  return command.execute({
    args,
    stdout: options.stdout,
    stderr: options.stderr,
  });
}
