import { describe, expect, it } from 'vitest';

import { CommandRegistry } from './command-registry.js';
import type { CliCommand } from './types.js';

function createCommand(overrides: Partial<CliCommand> = {}): CliCommand {
  return {
    name: 'show',
    description: 'Show configuration.',
    usage: 'discord-verify config show',
    execute: () => 0,
    ...overrides,
  };
}

describe('CommandRegistry', () => {
  it('resolves nested subcommands and aliases', () => {
    const showCommand = createCommand();
    const configCommand: CliCommand = {
      name: 'config',
      aliases: ['cfg'],
      description: 'Manage configuration.',
      usage: 'discord-verify config <subcommand>',
      subcommands: [showCommand],
    };
    const registry = new CommandRegistry();

    registry.register(configCommand);

    const resolved = registry.resolve(['cfg', 'show', '--format', 'json']);

    expect(resolved).toEqual({
      command: showCommand,
      commandPath: ['config', 'show'],
      args: ['--format', 'json'],
    });
    expect(registry.list(configCommand)).toEqual([showCommand]);
  });

  it('rejects duplicate names in the same command scope', () => {
    const registry = new CommandRegistry();

    registry.register(createCommand({ name: 'config' }));

    expect(() => registry.register(createCommand({ name: 'config' }))).toThrow(
      'CLI command name is already registered in this scope: config',
    );
  });
});
