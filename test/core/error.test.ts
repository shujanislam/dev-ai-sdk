import { describe, expect, it } from 'vitest';
import { SDKError } from '../../src/core/error';

describe('SDKError', () => {
  it('stores error metadata', () => {
    const error = new SDKError('failed', 'google', 'API_ERROR');

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('SDKError');
    expect(error.message).toBe('failed');
    expect(error.provider).toBe('google');
    expect(error.code).toBe('API_ERROR');
  });

  it('converts to ErrorType', () => {
    const error = new SDKError('failed', 'openai', 'CONFIG_ERROR');

    expect(error.toErrorType()).toEqual({
      name: 'SDKError',
      provider: 'openai',
      code: 'CONFIG_ERROR',
      message: 'failed',
    });
  });
});
