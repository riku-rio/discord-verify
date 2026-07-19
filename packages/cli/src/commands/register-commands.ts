import { CommandRegistry } from '../cli/command-registry.js';

import { createVersionCommand } from './version.js';

export function registerCommands(): CommandRegistry {
  const registry = new CommandRegistry();

  registry.register(createVersionCommand());

  return registry;
}
