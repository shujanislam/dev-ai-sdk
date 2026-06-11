import { afterEach, describe, expect, it, vi } from 'vitest';
import { anthropicProvider } from '../../src/providers/anthropic';
import { deepseekProvider } from '../../src/providers/deepseek';
import { googleCoreProvider } from '../../src/providers/google-core';
import { mistralProvider } from '../../src/providers/mistral';
import { openaiProvider } from '../../src/providers/openai';
import { SDKError } from '../../src/core/error';
import { jsonResponse } from '../helpers';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('non-streaming providers', () => {
  it('throws config errors when provider config is missing', async () => {
    await expect(googleCoreProvider({}, 'key')).rejects.toMatchObject({ provider: 'google', code: 'CONFIG_ERROR' });
    await expect(openaiProvider({}, 'key')).rejects.toMatchObject({ provider: 'openai', code: 'CONFIG_ERROR' });
    await expect(deepseekProvider({}, 'key')).rejects.toMatchObject({ provider: 'deepseek', code: 'CONFIG_ERROR' });
    await expect(mistralProvider({}, 'key')).rejects.toMatchObject({ provider: 'mistral', code: 'CONFIG_ERROR' });
    await expect(anthropicProvider({}, 'key')).rejects.toMatchObject({ provider: 'anthropic', code: 'CONFIG_ERROR' });
  });

  it('calls Google and normalizes output', async () => {
    const raw = { candidates: [{ content: { parts: [{ text: 'hello' }] } }] };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(raw) as any);

    const result = await googleCoreProvider({ google: { model: 'gemini', prompt: 'prompt', system: 'sys', temperature: 0.1, maxTokens: 10, raw: true } }, 'key');

    expect(fetchMock).toHaveBeenCalledWith('https://generativelanguage.googleapis.com/v1beta/models/gemini:generateContent', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': 'key' },
    }));
    expect(JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)).toEqual({
      contents: [{ parts: [{ text: 'sys prompt' }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 10 },
    });
    expect(result).toEqual({ data: 'hello', provider: 'google', model: 'gemini', raw });
  });

  it('calls OpenAI and normalizes output', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ output_text: 'hello' }) as any);

    const result = await openaiProvider({ openai: { model: 'gpt', prompt: 'prompt', system: 'sys' } }, 'key');

    expect(fetchMock).toHaveBeenCalledWith('https://api.openai.com/v1/responses', expect.objectContaining({
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer key' },
    }));
    expect(result).toEqual({ data: 'hello', provider: 'openai', model: 'gpt' });
  });

  it('calls DeepSeek and normalizes output', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ output_text: 'hello' }) as any);

    const result = await deepseekProvider({ deepseek: { model: 'deepseek-chat', prompt: 'prompt' } }, 'key');

    expect(fetchMock).toHaveBeenCalledWith('https://api.deepseek.com/chat/completions', expect.any(Object));
    expect(result).toEqual({ data: 'hello', provider: 'deepseek', model: 'deepseek-chat' });
  });

  it('calls Mistral and normalizes output', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ choices: [{ message: { content: 'hello' } }] }) as any);

    await expect(mistralProvider({ mistral: { model: 'mistral-tiny', prompt: 'prompt' } }, 'key')).resolves.toEqual({
      data: 'hello',
      provider: 'mistral',
      model: 'mistral-tiny',
    });
  });

  it('calls Anthropic and normalizes output', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ content: [{ text: 'hello' }] }) as any);

    const result = await anthropicProvider({ anthropic: { model: 'claude', prompt: 'prompt' } }, 'key');

    expect(fetchMock).toHaveBeenCalledWith('https://api.anthropic.com/v1/messages', expect.objectContaining({
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'key', 'anthropic-version': '2023-06-01' },
    }));
    expect(result).toEqual({ data: 'hello', provider: 'anthropic', model: 'claude' });
  });

  it('throws SDKError on API failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ error: { message: 'bad' } }, false, 400) as any);

    await expect(openaiProvider({ openai: { model: 'gpt', prompt: 'prompt' } }, 'key')).rejects.toBeInstanceOf(SDKError);
  });
});
