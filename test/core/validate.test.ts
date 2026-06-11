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
});
