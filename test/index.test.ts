import { describe, expect, it } from 'vitest';
import { SDKError, genChat, listFileTool, readFileTool, writeFileTool } from '../src/index';

describe('public exports', () => {
  it('exports client, SDKError, and built-in file tools', () => {
    expect(genChat).toBeTypeOf('function');
    expect(new SDKError('message', 'core', 'CODE')).toBeInstanceOf(Error);
    expect(readFileTool).toBeTypeOf('function');
    expect(writeFileTool).toBeTypeOf('function');
    expect(listFileTool).toBeTypeOf('function');
  });
});
