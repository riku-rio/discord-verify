import type { CommandRegistry } from '../cli/command-registry.js';
import type { TextOutput } from '../cli/types.js';

const HEADER = 'Discord Verify\n\nUsage:\n  discord-verify <command> [options]\n\nCommands:\n';

export function writeHelp(registry: CommandRegistry, stdout: TextOutput): void {
  stdout.write(HEADER);

  for (const command of registry.list()) {
    stdout.write(`  ${command.name.padEnd(12)} ${command.description}\n`);
  }

  stdout.write('\nOptions:\n  -h, --help   Show help output.\n  -V, --version  Print the installed version.\n');
}
