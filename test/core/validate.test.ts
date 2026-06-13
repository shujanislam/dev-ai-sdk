import { describe, expect, it } from 'vitest';
import { validateConfig, validateProvider } from '../../src/core/validate';
import { SDKError } from '../../src/core/error';

describe('validateConfig', () => {
  it('accepts configured providers with API keys', () => {
    expect(() => validateConfig({ google: { apiKey: 'key' } })).not.toThrow();
  });

  it('rejects missing config', () => {
    expect(() => validateConfig(undefined as any)).toThrow(SDKError);
  });

  it('rejects no configured providers', () => {
    expect(() => validateConfig({})).toThrow('no providers configured');
  });

  it.each(['google', 'openai', 'deepseek', 'mistral', 'anthropic'] as const)(
    'rejects blank %s api key',
    (provider) => {
      expect(() => validateConfig({ [provider]: { apiKey: '   ' } })).toThrow(`${provider}.apiKey is required`);
    },
  );
});

describe('validateProvider', () => {
  it.each(['google', 'openai', 'deepseek', 'mistral', 'anthropic'] as const)(
    'accepts valid %s provider',
    (provider) => {
      expect(() => validateProvider({ [provider]: { model: 'model', prompt: 'prompt' } })).not.toThrow();
    },
  );

  it('rejects no provider', () => {
    expect(() => validateProvider({})).toThrow('No provider passed');
  });

  it('rejects multiple providers', () => {
    expect(() => validateProvider({ google: { model: 'g', prompt: 'p' }, openai: { model: 'o', prompt: 'p' } })).toThrow('Pass only one provider');
  });

  it.each(['google', 'openai', 'deepseek', 'mistral', 'anthropic'] as const)(
    'rejects missing %s model and prompt',
    (provider) => {
      expect(() => validateProvider({ [provider]: { model: ' ', prompt: 'prompt' } })).toThrow(`${provider}.model is required`);
      expect(() => validateProvider({ [provider]: { model: 'model', prompt: ' ' } })).toThrow(`${provider}.prompt is required`);
    },
  );

  it('accepts valid tool config', () => {
    expect(() => validateProvider({
      google: {
        model: 'model',
        prompt: 'prompt',
        tool: [
          {
            name: 'readFile',
            description: 'Read a file',
            parameters: { type: 'object' },
            execute: () => 'ok',
          },
        ],
      },
    })).not.toThrow();
  });

  it('rejects invalid tool config', () => {
    expect(() => validateProvider({
      google: {
        model: 'model',
        prompt: 'prompt',
        tool: [
          {
            name: '',
            description: 'Read a file',
            parameters: { type: 'object' },
            execute: () => 'ok',
          },
        ],
      },
    })).toThrow('google.tool[0].name is required');

    expect(() => validateProvider({
      google: {
        model: 'model',
        prompt: 'prompt',
        tool: [
          {
            name: 'same',
            description: 'First',
            parameters: { type: 'object' },
            execute: () => 'ok',
          },
          {
            name: 'same',
            description: 'Second',
            parameters: { type: 'object' },
            execute: () => 'ok',
          },
        ],
      },
    })).toThrow('google.tool contains duplicate tool name: same');

    expect(() => validateProvider({
      google: {
        model: 'model',
        prompt: 'prompt',
        tool: [
          {
            name: 'bad',
            description: 'Bad execute',
            parameters: { type: 'object' },
            execute: 'not-a-function',
          } as any,
        ],
      },
    })).toThrow('google.tool[0].execute must be a function');
  });
});
