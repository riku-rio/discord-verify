import type { CliCommand } from './types.js';

const COMMAND_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

export class CommandRegistry {
  readonly #commandsByName = new Map<string, CliCommand>();
  readonly #primaryCommands = new Map<string, CliCommand>();

  register(command: CliCommand): void {
    const names = [command.name, ...(command.aliases ?? [])];

    for (const name of names) {
      if (!COMMAND_NAME_PATTERN.test(name)) {
        throw new Error(`Invalid CLI command name: ${name}`);
      }

      if (this.#commandsByName.has(name)) {
        throw new Error(`CLI command name is already registered: ${name}`);
      }
    }

    this.#primaryCommands.set(command.name, command);

    for (const name of names) {
      this.#commandsByName.set(name, command);
    }
  }

  get(name: string): CliCommand | undefined {
    return this.#commandsByName.get(name);
  }

  list(includeHidden = false): readonly CliCommand[] {
    return [...this.#primaryCommands.values()]
      .filter((command) => includeHidden || command.hidden !== true)
      .sort((left, right) => left.name.localeCompare(right.name));
  }
}
