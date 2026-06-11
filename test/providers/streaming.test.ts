import { afterEach, describe, expect, it, vi } from 'vitest';
import { deepseekStreamProvider } from '../../src/providers/deepseek-stream';
import { googleStreamProvider } from '../../src/providers/google-stream';
import { mistralStreamProvider } from '../../src/providers/mistral-stream';
import { openaiStreamProvider } from '../../src/providers/openai-stream';
import { collectStream, streamResponse } from '../helpers';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('streaming providers', () => {
  it('throws config errors when provider config is missing', async () => {
    await expect(collectStream(googleStreamProvider({}, 'key'))).rejects.toMatchObject({ provider: 'google', code: 'CONFIG_ERROR' });
    await expect(collectStream(openaiStreamProvider({}, 'key'))).rejects.toMatchObject({ provider: 'openai', code: 'CONFIG_ERROR' });
    await expect(collectStream(deepseekStreamProvider({}, 'key'))).rejects.toMatchObject({ provider: 'deepseek', code: 'CONFIG_ERROR' });
    await expect(collectStream(mistralStreamProvider({}, 'key'))).rejects.toMatchObject({ provider: 'mistral', code: 'CONFIG_ERROR' });
  });

  it('parses Google stream arrays', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(streamResponse([JSON.stringify([{ candidates: [{ content: { parts: [{ text: 'hi' }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 1, candidatesTokenCount: 2, totalTokenCount: 3 } }])]) as any);

    const values = await collectStream(googleStreamProvider({ google: { model: 'gemini', prompt: 'prompt' } }, 'key'));

    expect(values).toEqual([{ text: 'hi', done: true, tokens: { prompt: 1, completion: 2, total: 3 }, raw: expect.any(Object), provider: 'google' }]);
  });

  it('parses OpenAI newline JSON events and skips malformed lines', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(streamResponse(['bad\n', JSON.stringify({ output_text: 'hi' }) + '\n']) as any);

    const values = await collectStream(openaiStreamProvider({ openai: { model: 'gpt', prompt: 'prompt' } }, 'key'));

    expect(values).toEqual([{ text: 'hi', done: true, tokens: undefined, raw: { output_text: 'hi' }, provider: 'openai' }]);
  });

  it('parses DeepSeek stream events', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(streamResponse([JSON.stringify({ choices: [{ delta: { content: 'hi' }, finish_reason: 'stop' }], usage: { prompt_tokens: 1, completion_tokens: 2 } }) + '\n']) as any);

    const values = await collectStream(deepseekStreamProvider({ deepseek: { model: 'deepseek-chat', prompt: 'prompt' } }, 'key'));

    expect(values).toEqual([{ text: 'hi', done: true, tokens: { prompt: 1, completion: 2, total: 3 }, raw: expect.any(Object), provider: 'deepseek' }]);
  });

  it('parses Mistral stream events', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(streamResponse([JSON.stringify({ choices: [{ delta: { content: 'hi' }, finish_reason: 'stop' }], usage: { prompt_tokens: 1, completion_tokens: 2 } }) + '\n']) as any);

    const values = await collectStream(mistralStreamProvider({ mistral: { model: 'mistral-tiny', prompt: 'prompt' } }, 'key'));

    expect(values).toEqual([{ text: 'hi', done: true, tokens: { prompt: 1, completion: 2, total: 3 }, raw: expect.any(Object), provider: 'mistral' }]);
  });

  it('throws on streaming API errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(streamResponse([], false, 500) as any);

    await expect(collectStream(openaiStreamProvider({ openai: { model: 'gpt', prompt: 'prompt' } }, 'key'))).rejects.toMatchObject({ provider: 'openai', code: 'API_ERROR' });
  });
});
