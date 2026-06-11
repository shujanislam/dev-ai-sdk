import { describe, expect, it } from 'vitest';
import { SDKError, genChat } from '../src/index';

describe('public exports', () => {
  it('exports client and SDKError', () => {
    expect(genChat).toBeTypeOf('function');
    expect(new SDKError('message', 'core', 'CODE')).toBeInstanceOf(Error);
  });
});
