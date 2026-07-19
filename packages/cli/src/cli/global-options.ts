import { parseArgs } from 'node:util';

import { CliUsageError } from './errors.js';
import type {
  GlobalCliOptions,
  GlobalOptionValidator,
  ParsedCliInput,
} from './types.js';

const GLOBAL_OPTIONS = {
  json: { type: 'boolean' },
  'non-interactive': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  quiet: { type: 'boolean' },
  verbose: { type: 'boolean' },
  trace: { type: 'boolean' },
  profile: { type: 'string' },
  config: { type: 'string' },
  cwd: { type: 'string' },
  timeout: { type: 'string' },
  help: { type: 'boolean', short: 'h' },
  version: { type: 'boolean', short: 'V' },
} as const;

const GLOBAL_OPTION_NAMES = new Set(Object.keys(GLOBAL_OPTIONS));
const STRING_OPTION_NAMES = new Set(['profile', 'config', 'cwd', 'timeout']);

const DEFAULT_GLOBAL_OPTION_VALIDATORS: readonly GlobalOptionValidator[] = [
  validateOutputVerbosity,
];

export function parseCliInput(
  argv: readonly string[],
  validators: readonly GlobalOptionValidator[] = DEFAULT_GLOBAL_OPTION_VALIDATORS,
): ParsedCliInput {
  const parsed = parseRawArgs(argv);
  const commandToken = parsed.tokens.find((token) => token.kind === 'positional');
  const commandIndex = commandToken?.index;

  rejectUnknownRootOptions(parsed.tokens, commandIndex);

  const globalOptions: GlobalCliOptions = {
    json: parsed.values.json ?? false,
    nonInteractive: parsed.values['non-interactive'] ?? false,
    noColor: parsed.values['no-color'] ?? false,
    quiet: parsed.values.quiet ?? false,
    verbose: parsed.values.verbose ?? false,
    trace: parsed.values.trace ?? false,
    profile: parseNonEmptyValue(parsed.values.profile, '--profile'),
    config: parseNonEmptyValue(parsed.values.config, '--config'),
    cwd: parseNonEmptyValue(parsed.values.cwd, '--cwd'),
    timeout: parseTimeout(parsed.values.timeout),
  };

  for (const validate of validators) {
    validate(globalOptions);
  }

  if (commandIndex === undefined) {
    return {
      commandName: undefined,
      commandArgs: [],
      globalOptions,
      helpRequested: parsed.values.help ?? false,
      versionRequested: parsed.values.version ?? false,
    };
  }

  const commandName = argv[commandIndex];

  if (commandName === undefined) {
    throw new Error('CLI parser returned an invalid command index.');
  }

  const consumedGlobalOptionIndexes = collectConsumedGlobalOptionIndexes(parsed.tokens);
  const commandArgs = argv.filter(
    (_argument, index) => index > commandIndex && !consumedGlobalOptionIndexes.has(index),
  );

  return {
    commandName,
    commandArgs,
    globalOptions,
    helpRequested: parsed.values.help ?? false,
    versionRequested: parsed.values.version ?? false,
  };
}

function parseRawArgs(argv: readonly string[]) {
  try {
    return parseArgs({
      args: [...argv],
      options: GLOBAL_OPTIONS,
      allowPositionals: true,
      strict: false,
      tokens: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new CliUsageError(error.message, { cause: error });
    }

    throw error;
  }
}

function rejectUnknownRootOptions(
  tokens: ReturnType<typeof parseRawArgs>['tokens'],
  commandIndex: number | undefined,
): void {
  for (const token of tokens) {
    if (
      token.kind === 'option' &&
      !GLOBAL_OPTION_NAMES.has(token.name) &&
      (commandIndex === undefined || token.index < commandIndex)
    ) {
      throw new CliUsageError(`Unknown option: ${token.rawName}`);
    }
  }
}

function collectConsumedGlobalOptionIndexes(
  tokens: ReturnType<typeof parseRawArgs>['tokens'],
): ReadonlySet<number> {
  const indexes = new Set<number>();

  for (const token of tokens) {
    if (token.kind !== 'option' || !GLOBAL_OPTION_NAMES.has(token.name)) {
      continue;
    }

    indexes.add(token.index);

    if (STRING_OPTION_NAMES.has(token.name) && token.inlineValue === false) {
      indexes.add(token.index + 1);
    }
  }

  return indexes;
}

function parseNonEmptyValue(value: string | undefined, optionName: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value.trim().length === 0) {
    throw new CliUsageError(`${optionName} requires a non-empty value.`);
  }

  return value;
}

function parseTimeout(value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!/^[1-9]\d*$/.test(value)) {
    throw new CliUsageError('--timeout must be a positive integer in milliseconds.');
  }

  const timeout = Number(value);

  if (!Number.isSafeInteger(timeout)) {
    throw new CliUsageError('--timeout exceeds the supported integer range.');
  }

  return timeout;
}

function validateOutputVerbosity(options: Readonly<GlobalCliOptions>): void {
  if (options.quiet && (options.verbose || options.trace)) {
    throw new CliUsageError('--quiet cannot be combined with --verbose or --trace.');
  }
}
