import type { Provider } from '../types/types';
import type { SDKConfig } from './config';
import { SDKError } from './error';

export function validateProvider(provider: Provider) {
  const hasGoogle = !!provider.google;
  const hasOpenAI = !!provider.openai;

  if (!hasGoogle && !hasOpenAI) throw new SDKError("No provider passed", "core");
  if (hasGoogle && hasOpenAI) throw new SDKError("Pass only one provider", "core");

  if (hasGoogle) {
    if (!provider.google!.model.trim()) throw new SDKError("google.model is required", "google");
    if (!provider.google!.prompt.trim()) throw new SDKError("google.prompt is required", "google");
  }

  if (hasOpenAI) {
    if (!provider.openai!.model.trim()) throw new SDKError("openai.model is required", "openai");
    if (!provider.openai!.prompt.trim()) throw new SDKError("openai.prompt is required", "openai");
  }
}

export function validateConfig(sdkConfig: SDKConfig) {
  if (!sdkConfig) {
    throw new SDKError('no providers configured', 'core');
  }

  const hasGoogle = !!sdkConfig.google;
  const hasOpenAI = !!sdkConfig.openai;

  if (!hasGoogle && !hasOpenAI) {
    throw new SDKError('no providers configured', 'core');
  }

  if (hasGoogle) {
    const key = sdkConfig.google?.apiKey;
    if (typeof key !== 'string' || key.trim().length === 0) {
      throw new SDKError('google.apiKey is required', 'google');
    }
  }

  if (hasOpenAI) {
    const key = sdkConfig.openai?.apiKey;
    if (typeof key !== 'string' || key.trim().length === 0) {
      throw new SDKError('openai.apiKey is required', 'openai');
    }
  }
}

