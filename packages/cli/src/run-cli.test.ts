import { describe, expect, it } from 'vitest';

import { runCli } from './run-cli.js';

class BufferOutput {
  value = '';

  write(chunk: string): void {
    this.value += chunk;
  }
}

async function invoke(argv: readonly string[]) {
  const stdout = new BufferOutput();
  const stderr = new BufferOutput();
  const exitCode = await runCli({ argv, stdout, stderr });

  return { exitCode, stdout: stdout.value, stderr: stderr.value };
}

describe('runCli', () => {
  it('prints root help with every global option', async () => {
    const result = await invoke([]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('discord-verify <command> [options]');
    expect(result.stdout).toContain('--json');
    expect(result.stdout).toContain('--non-interactive');
    expect(result.stdout).toContain('--no-color');
    expect(result.stdout).toContain('--quiet');
    expect(result.stdout).toContain('--verbose');
    expect(result.stdout).toContain('--trace');
    expect(result.stdout).toContain('--profile <name>');
    expect(result.stdout).toContain('--config <path>');
    expect(result.stdout).toContain('--cwd <path>');
    expect(result.stdout).toContain('--timeout <milliseconds>');
    expect(result.stderr).toBe('');
  });

  it('prints help for --help', async () => {
    const result = await invoke(['--help']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Discord Verify');
    expect(result.stderr).toBe('');
  });

  it('keeps parser help out of stdout in JSON mode', async () => {
    const result = await invoke(['--json', '--help']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Discord Verify');
  });

  it('prints the package version with the version command', async () => {
    const result = await invoke(['version']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('0.0.0\n');
    expect(result.stderr).toBe('');
  });

  it('prints the package version with --version', async () => {
    const result = await invoke(['--version']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('0.0.0\n');
    expect(result.stderr).toBe('');
  });

  it('keeps version output out of stdout in JSON mode', async () => {
    const result = await invoke(['version', '--json']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('0.0.0\n');
  });

  it('runs command validation hooks before execution', async () => {
    const result = await invoke(['version', 'unexpected']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('version does not accept arguments: unexpected');
  });

  it('rejects parser errors without writing to stdout', async () => {
    const result = await invoke(['--timeout', '0', 'version', '--json']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('--timeout must be a positive integer in milliseconds.');
  });

  it('rejects unknown commands without writing to stdout', async () => {
    const result = await invoke(['missing']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Unknown command: missing');
  });
});
