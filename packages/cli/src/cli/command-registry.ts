import type { CliCommand, ResolvedCliCommand } from './types.js';

const COMMAND_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

interface CommandScope {
  commandsByName: Map<string, CliCommand>;
  primaryCommands: Map<string, CliCommand>;
}

function createScope(): CommandScope {
  return {
    commandsByName: new Map<string, CliCommand>(),
    primaryCommands: new Map<string, CliCommand>(),
  };
}

export class CommandRegistry {
  readonly #rootScope = createScope();
  readonly #childScopes = new Map<CliCommand, CommandScope>();
  readonly #registeredCommands = new Set<CliCommand>();

  register(command: CliCommand): void {
    this.#registerInScope(command, this.#rootScope);
  }

  get(name: string): CliCommand | undefined {
    return this.#rootScope.commandsByName.get(name);
  }

  list(parent?: CliCommand, includeHidden = false): readonly CliCommand[] {
    const scope = parent === undefined ? this.#rootScope : this.#childScopes.get(parent);

    if (scope === undefined) {
      return [];
    }

    return [...scope.primaryCommands.values()]
      .filter((command) => includeHidden || command.hidden !== true)
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  resolve(argv: readonly string[]): ResolvedCliCommand | undefined {
    let scope = this.#rootScope;
    let command: CliCommand | undefined;
    const commandPath: string[] = [];
    let consumedArguments = 0;

    while (consumedArguments < argv.length) {
      const commandName = argv[consumedArguments];

      if (commandName === undefined) {
        break;
      }

      const nextCommand = scope.commandsByName.get(commandName);

      if (nextCommand === undefined) {
        break;
      }

      command = nextCommand;
      commandPath.push(nextCommand.name);
      consumedArguments += 1;

      const childScope = this.#childScopes.get(nextCommand);

      if (childScope === undefined) {
        break;
      }

      scope = childScope;
    }

    if (command === undefined) {
      return undefined;
    }

    return {
      command,
      commandPath,
      args: argv.slice(consumedArguments),
    };
  }

  #registerInScope(command: CliCommand, scope: CommandScope): void {
    if (this.#registeredCommands.has(command)) {
      throw new Error(`CLI command is already registered: ${command.name}`);
    }

    const names = [command.name, ...(command.aliases ?? [])];

    for (const name of names) {
      if (!COMMAND_NAME_PATTERN.test(name)) {
        throw new Error(`Invalid CLI command name: ${name}`);
      }

      if (scope.commandsByName.has(name)) {
        throw new Error(`CLI command name is already registered in this scope: ${name}`);
      }
    }

    this.#registeredCommands.add(command);
    scope.primaryCommands.set(command.name, command);

    for (const name of names) {
      scope.commandsByName.set(name, command);
    }

    if (command.subcommands === undefined || command.subcommands.length === 0) {
      return;
    }

    const childScope = createScope();
    this.#childScopes.set(command, childScope);

    for (const subcommand of command.subcommands) {
      this.#registerInScope(subcommand, childScope);
    }
  }
}
