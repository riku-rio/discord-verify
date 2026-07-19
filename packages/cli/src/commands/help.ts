import type { CommandRegistry } from '../cli/command-registry.js';
import type { TextOutput } from '../cli/types.js';

const HEADER = 'Discord Verify\n\nUsage:\n  discord-verify <command> [options]\n\nCommands:\n';

const GLOBAL_OPTIONS = [
  ['-h, --help', 'Show help output.'],
  ['-V, --version', 'Print the installed version.'],
  ['--json', 'Use machine-readable output.'],
  ['--non-interactive', 'Disable interactive prompts.'],
  ['--no-color', 'Disable ANSI color output.'],
  ['--quiet', 'Suppress non-essential diagnostics.'],
  ['--verbose', 'Enable verbose diagnostics.'],
  ['--trace', 'Enable trace diagnostics.'],
  ['--profile <name>', 'Select a configuration profile.'],
  ['--config <path>', 'Use an explicit configuration file.'],
  ['--cwd <path>', 'Use an explicit working directory.'],
  ['--timeout <milliseconds>', 'Set the operation timeout.'],
] as const;

export function writeHelp(registry: CommandRegistry, output: TextOutput): void {
  output.write(HEADER);

  for (const command of registry.list()) {
    output.write(`  ${command.name.padEnd(12)} ${command.description}\n`);
  }

  output.write('\nGlobal options:\n');

  for (const [flags, description] of GLOBAL_OPTIONS) {
    output.write(`  ${flags.padEnd(27)} ${description}\n`);
  }
}
