import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/providers/google-core', () => ({
  googleCoreProvider: vi.fn().mockResolvedValue({ data: 'core', provider: 'google', model: 'gemini' }),
}));

vi.mock('../../src/providers/google-stream', () => ({
  googleStreamProvider: vi.fn().mockReturnValue('stream'),
}));

const { googleCoreProvider } = await import('../../src/providers/google-core');
const { googleStreamProvider } = await import('../../src/providers/google-stream');
const { googleProvider } = await import('../../src/providers/google');

describe('googleProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses core provider by default', async () => {
    await expect(googleProvider({ google: { model: 'gemini', prompt: 'prompt' } }, 'key')).resolves.toEqual({ data: 'core', provider: 'google', model: 'gemini' });
    expect(googleCoreProvider).toHaveBeenCalledOnce();
  });

  it('uses stream provider when stream is true', async () => {
    await expect(googleProvider({ google: { model: 'gemini', prompt: 'prompt', stream: true } }, 'key')).resolves.toBe('stream');
    expect(googleStreamProvider).toHaveBeenCalledOnce();
  });
});
