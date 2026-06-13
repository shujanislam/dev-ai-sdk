import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { executeTool } from '../../src/core/tools';
import { SDKError } from '../../src/core/error';
import { listFileTool, readFileTool, writeFileTool } from '../../src/core/tools/file';

let tempDir: string | undefined;

afterEach(async () => {
  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = undefined;
  }
});

describe('executeTool', () => {
  it('executes a matching tool by name', async () => {
    const execute = vi.fn().mockResolvedValue('ok');

    await expect(executeTool([{ name: 'example', description: 'Example tool', parameters: {}, execute }], 'example', { value: 1 })).resolves.toBe('ok');
    expect(execute).toHaveBeenCalledWith({ value: 1 });
  });

  it('throws SDKError when tool is missing', async () => {
    await expect(executeTool([], 'missing', {})).rejects.toMatchObject({
      provider: 'core',
      code: 'TOOL_NOT_FOUND',
    });
  });

  it('wraps non-SDK tool failures', async () => {
    const execute = vi.fn().mockRejectedValue(new Error('boom'));

    await expect(executeTool([{ name: 'explode', description: 'Explodes', parameters: {}, execute }], 'explode', {})).rejects.toMatchObject({
      provider: 'core',
      code: 'TOOL_EXECUTION_ERROR',
    });
  });
});

describe('file tools', () => {
  it('writes, reads, and lists files', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'dev-ai-sdk-'));
    const filePath = join(tempDir, 'hello.txt');

    await expect(writeFileTool({ filePath, data: 'hello' })).resolves.toContain(filePath);
    await expect(readFileTool({ filePath })).resolves.toBe('hello');
    await expect(listFileTool({ filePath: tempDir })).resolves.toContain('hello.txt');
  });

  it('throws SDKError for invalid file arguments', async () => {
    await expect(readFileTool({ filePath: ' ' })).rejects.toBeInstanceOf(SDKError);
    await expect(writeFileTool({ filePath: ' ', data: 'x' })).rejects.toMatchObject({ code: 'TOOL_ARGUMENT_ERROR' });
  });
});
