import { describe, expect, it } from 'vitest';

import { CliUsageError } from './errors.js';
import { parseCliInput } from './global-options.js';
import type { GlobalCliOptions } from './types.js';

describe('parseCliInput', () => {
  it('parses typed global options around a command and preserves command options', () => {
    const result = parseCliInput([
      '--profile',
      'ci',
      'verify',
      '--changed',
      '--json',
      '--non-interactive',
      '--no-color',
      '--quiet',
      '--config',
      'discord-verify.json',
      '--cwd',
      'fixture',
      '--timeout',
      '2500',
      'target',
    ]);

    expect(result.commandName).toBe('verify');
    expect(result.commandArgs).toEqual(['--changed', 'target']);
    expect(result.globalOptions).toEqual({
      json: true,
      nonInteractive: true,
      noColor: true,
      quiet: true,
      verbose: false,
      trace: false,
      profile: 'ci',
      config: 'discord-verify.json',
      cwd: 'fixture',
      timeout: 2500,
    });
  });

  it('parses verbose and trace flags', () => {
    const result = parseCliInput(['version', '--verbose', '--trace']);

    expect(result.globalOptions.verbose).toBe(true);
    expect(result.globalOptions.trace).toBe(true);
  });

  it('runs custom validation hooks', () => {
    let received: Readonly<GlobalCliOptions> | undefined;

    const result = parseCliInput(['version'], [
      (options) => {
        received = options;
      },
    ]);

    expect(received).toBe(result.globalOptions);
  });

  it('rejects non-positive timeout values', () => {
    expect(() => parseCliInput(['version', '--timeout', '0'])).toThrow(CliUsageError);
  });

  it('rejects incompatible verbosity flags', () => {
    expect(() => parseCliInput(['--quiet', '--trace', 'version'])).toThrow(
      '--quiet cannot be combined with --verbose or --trace.',
    );
  });

  it('rejects unknown options at the root parser level', () => {
    expect(() => parseCliInput(['--missing'])).toThrow('Unknown option: --missing');
  });
});
