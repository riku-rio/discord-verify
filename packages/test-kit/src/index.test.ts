import { access } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { createTemporaryDirectory } from './index.js';

describe('createTemporaryDirectory', () => {
  it('creates and cleans a directory', async () => {
    const temporary = await createTemporaryDirectory();
    await expect(access(temporary.path)).resolves.toBeUndefined();
    await temporary.cleanup();
    await expect(access(temporary.path)).rejects.toBeDefined();
  });
});
