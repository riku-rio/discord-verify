import { CliUsageError } from '../cli/errors.js';
import type { CliCommand } from '../cli/types.js';
import { getPackageVersion } from '../package-metadata.js';

export function createVersionCommand(): CliCommand {
  return {
    name: 'version',
    description: 'Print the installed discord-verify version.',
    usage: 'discord-verify version',
    validate({ args }) {
      if (args.length > 0) {
        throw new CliUsageError(`version does not accept arguments: ${args.join(' ')}`);
      }
    },
    execute({ stdout }) {
      stdout.write(`${getPackageVersion()}\n`);
      return 0;
    },
  };
}
