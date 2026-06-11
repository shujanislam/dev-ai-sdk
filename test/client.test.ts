import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SDKError } from '../src/core/error';

vi.mock('../src/providers/google-core', () => ({ googleCoreProvider: vi.fn() }));
vi.mock('../src/providers/google-stream', () => ({ googleStreamProvider: vi.fn() }));
vi.mock('../src/providers/openai', () => ({ openaiProvider: vi.fn() }));
vi.mock('../src/providers/openai-stream', () => ({ openaiStreamProvider: vi.fn() }));
vi.mock('../src/providers/deepseek', () => ({ deepseekProvider: vi.fn() }));
vi.mock('../src/providers/deepseek-stream', () => ({ deepseekStreamProvider: vi.fn() }));
vi.mock('../src/providers/mistral', () => ({ mistralProvider: vi.fn() }));
vi.mock('../src/providers/mistral-stream', () => ({ mistralStreamProvider: vi.fn() }));
vi.mock('../src/providers/anthropic', () => ({ anthropicProvider: vi.fn() }));
vi.mock('../src/core/fallbackEngine', () => ({ fallbackEngine: vi.fn() }));

const { googleCoreProvider } = await import('../src/providers/google-core');
const { googleStreamProvider } = await import('../src/providers/google-stream');
const { openaiProvider } = await import('../src/providers/openai');
const { openaiStreamProvider } = await import('../src/providers/openai-stream');
const { anthropicProvider } = await import('../src/providers/anthropic');
const { fallbackEngine } = await import('../src/core/fallbackEngine');
const { genChat } = await import('../src/client');

describe('genChat', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('validates config in constructor', () => {
    expect(() => new genChat({})).toThrow(SDKError);
  });

  it('routes non-streaming generation to selected provider', async () => {
    vi.mocked(googleCoreProvider).mockResolvedValue({ data: 'ok', provider: 'google', model: 'gemini' });

    const ai = new genChat({ google: { apiKey: 'key' } });
    await expect(ai.generate({ google: { model: 'gemini', prompt: 'prompt' } })).resolves.toEqual({ data: 'ok', provider: 'google', model: 'gemini' });
    expect(googleCoreProvider).toHaveBeenCalledWith({ google: { model: 'gemini', prompt: 'prompt' } }, 'key');
  });

  it('routes streaming generation to stream providers', async () => {
    vi.mocked(openaiStreamProvider).mockReturnValue('stream' as any);

    const ai = new genChat({ openai: { apiKey: 'key' } });
    await expect(ai.generate({ openai: { model: 'gpt', prompt: 'prompt', stream: true } })).resolves.toBe('stream');
    expect(openaiStreamProvider).toHaveBeenCalledOnce();
  });

  it('rejects Anthropic streaming', async () => {
    const ai = new genChat({ anthropic: { apiKey: 'key' } });

    await expect(ai.generate({ anthropic: { model: 'claude', prompt: 'prompt', stream: true } })).rejects.toMatchObject({ code: 'STREAMING_NOT_SUPPORTED' });
  });

  it('uses fallback for non-streaming SDK errors when enabled', async () => {
    vi.mocked(openaiProvider).mockRejectedValue(new SDKError('bad', 'openai', 'API_ERROR'));
    vi.mocked(fallbackEngine).mockResolvedValue({ data: 'fallback', provider: 'google', model: 'gemini' });

    const ai = new genChat({ openai: { apiKey: 'o' }, google: { apiKey: 'g' }, fallback: true });

    await expect(ai.generate({ openai: { model: 'gpt', prompt: 'prompt' } })).resolves.toEqual({ data: 'fallback', provider: 'google', model: 'gemini' });
    expect(fallbackEngine).toHaveBeenCalledOnce();
  });

  it('does not fallback for streaming errors', async () => {
    vi.mocked(googleStreamProvider).mockImplementation(() => {
      throw new SDKError('bad', 'google', 'API_ERROR');
    });

    const ai = new genChat({ google: { apiKey: 'g' }, openai: { apiKey: 'o' }, fallback: true });

    await expect(ai.generate({ google: { model: 'gemini', prompt: 'prompt', stream: true } })).rejects.toMatchObject({ provider: 'google' });
    expect(fallbackEngine).not.toHaveBeenCalled();
  });

  it('wraps unknown errors', async () => {
    vi.mocked(anthropicProvider).mockRejectedValue(new Error('boom'));

    const ai = new genChat({ anthropic: { apiKey: 'a' } });

    await expect(ai.generate({ anthropic: { model: 'claude', prompt: 'prompt' } })).rejects.toMatchObject({ code: 'UNEXPECTED_ERROR' });
  });

  it('generates council member responses and judge decision', async () => {
    vi.mocked(openaiProvider)
      .mockResolvedValueOnce({ data: 'member one', provider: 'openai', model: 'gpt' })
      .mockResolvedValueOnce({ data: 'final', provider: 'openai', model: 'judge' });
    vi.mocked(googleCoreProvider).mockResolvedValue({ data: 'member two', provider: 'google', model: 'gemini' });

    const ai = new genChat({ openai: { apiKey: 'o' }, google: { apiKey: 'g' } });
    const result = await ai.councilGenerate({
      judge: { openai: 'judge' },
      members: [{ openai: 'gpt' }, { google: 'gemini' }],
      prompt: 'prompt',
      system: 'system',
    });

    expect(result).toEqual({ decision: 'final' });
    expect(openaiProvider).toHaveBeenCalledTimes(2);
    expect(googleCoreProvider).toHaveBeenCalledOnce();
  });

  it('rejects council generation without members or judge', async () => {
    const ai = new genChat({ openai: { apiKey: 'o' } });

    await expect(ai.councilGenerate({ judge: { openai: 'judge' }, members: [], prompt: 'prompt' })).rejects.toMatchObject({ code: 'NO_MEMBERS' });
    await expect(ai.councilGenerate({ judge: {}, members: [{ openai: 'gpt' }], prompt: 'prompt' })).rejects.toMatchObject({ code: 'NO_JUDGE' });
  });
});
