import { afterEach, describe, expect, it, vi } from 'vitest';
import { googleCoreProvider } from '../../src/providers/google-core';

function mockJsonResponse(data: any, ok = true, status = 200) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  } as any;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('googleCoreProvider tool calling', () => {
  it('sends tool declarations, executes function calls, and returns final text', async () => {
    const execute = vi.fn().mockResolvedValue('tool result');
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(mockJsonResponse({
        candidates: [
          {
            content: {
              role: 'model',
              parts: [
                {
                  functionCall: {
                    name: 'readFile',
                    args: { filePath: 'package.json' },
                  },
                },
              ],
            },
          },
        ],
      }))
      .mockResolvedValueOnce(mockJsonResponse({
        candidates: [
          {
            content: {
              parts: [{ text: 'final answer' }],
            },
          },
        ],
      }));

    vi.stubGlobal('fetch', fetch);

    await expect(googleCoreProvider({
      google: {
        model: 'gemini',
        prompt: 'read package.json',
        tool: [
          {
            name: 'readFile',
            description: 'Read a file',
            parameters: {
              type: 'object',
              properties: { filePath: { type: 'string' } },
              required: ['filePath'],
            },
            execute,
          },
        ],
      },
    }, 'key')).resolves.toEqual({ data: 'final answer', provider: 'google', model: 'gemini' });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(execute).toHaveBeenCalledWith({ filePath: 'package.json' });

    const firstBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(firstBody.tools[0].functionDeclarations[0]).toMatchObject({
      name: 'readFile',
      description: 'Read a file',
    });

    const secondBody = JSON.parse(fetch.mock.calls[1][1].body);
    expect(secondBody.contents[2].parts[0].functionResponse).toEqual({
      name: 'readFile',
      response: { result: 'tool result' },
    });
  });
});
