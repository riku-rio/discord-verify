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
  it('prints help from the root command', async () => {
    const result = await invoke([]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Usage:');
    expect(result.stdout).toContain('discord-verify <command> [options]');
    expect(result.stdout).toContain('version');
    expect(result.stderr).toBe('');
  });

  it('prints help for --help', async () => {
    const result = await invoke(['--help']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Discord Verify');
    expect(result.stderr).toBe('');
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

  it('rejects unknown commands without writing to stdout', async () => {
    const result = await invoke(['missing']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Unknown command: missing');
  });
});
