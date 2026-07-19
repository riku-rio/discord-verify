import { getPackageVersion } from '../package-metadata.js';

import type { CliCommand } from '../cli/types.js';

export function createVersionCommand(): CliCommand {
  return {
    name: 'version',
    description: 'Print the installed discord-verify version.',
    usage: 'discord-verify version',
    execute({ stdout }) {
      stdout.write(`${getPackageVersion()}\n`);
      return 0;
    },
  };
}
