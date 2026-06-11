import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SDKError } from '../../src/core/error';

vi.mock('../../src/providers/google-core', () => ({ googleCoreProvider: vi.fn() }));
vi.mock('../../src/providers/openai', () => ({ openaiProvider: vi.fn() }));
vi.mock('../../src/providers/deepseek', () => ({ deepseekProvider: vi.fn() }));
vi.mock('../../src/providers/mistral', () => ({ mistralProvider: vi.fn() }));

const { googleCoreProvider } = await import('../../src/providers/google-core');
const { openaiProvider } = await import('../../src/providers/openai');
const { deepseekProvider } = await import('../../src/providers/deepseek');
const { fallbackEngine } = await import('../../src/core/fallbackEngine');

describe('fallbackEngine', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('uses the first configured candidate excluding the failed provider', async () => {
    vi.mocked(openaiProvider).mockResolvedValue({ data: 'ok', provider: 'openai', model: 'gpt-5.2' });

    const result = await fallbackEngine('google', { google: { apiKey: 'g' }, openai: { apiKey: 'o' } }, { google: { model: 'gemini', prompt: 'prompt', system: 'sys', temperature: 0.2, maxTokens: 5, raw: true } });

    expect(result).toEqual({ data: 'ok', provider: 'openai', model: 'gpt-5.2' });
    expect(openaiProvider).toHaveBeenCalledWith({ openai: { model: 'gpt-5.2', prompt: 'prompt', system: 'sys', temperature: 0.2, maxTokens: 5, raw: true } }, 'o');
  });

  it('tries later candidates when an earlier fallback fails', async () => {
    vi.mocked(googleCoreProvider).mockRejectedValue(new SDKError('bad', 'google', 'API_ERROR'));
    vi.mocked(deepseekProvider).mockResolvedValue({ data: 'ok', provider: 'deepseek', model: 'deepseek-chat' });

    const result = await fallbackEngine('openai', { google: { apiKey: 'g' }, deepseek: { apiKey: 'd' } }, { openai: { model: 'gpt', prompt: 'prompt' } });

    expect(result.provider).toBe('deepseek');
    expect(googleCoreProvider).toHaveBeenCalledOnce();
    expect(deepseekProvider).toHaveBeenCalledOnce();
  });

  it('throws when no fallback providers are configured', async () => {
    await expect(fallbackEngine('google', { google: { apiKey: 'g' } }, { google: { model: 'gemini', prompt: 'prompt' } })).rejects.toMatchObject({ code: 'FALLBACK_CONFIG_ERROR' });
  });
});
