import type { Provider } from '../types/types';
import type { SDKConfig } from './config';
import { SDKError } from './error';


export function validateProvider(provider: Provider) {
  const hasGoogle = !!provider.google;
  const hasOpenAI = !!provider.openai;
  const hasDeepSeek = !!provider.deepseek;
  const hasMistral = !!provider.mistral;
  const hasAnthropic = !!provider.anthropic;

  const totalProviders = Number(hasGoogle) + Number(hasOpenAI) + Number(hasDeepSeek) + Number(hasMistral) + Number(hasAnthropic);

  if (totalProviders === 0) throw new SDKError("No provider passed", "core", "VALIDATION_ERROR");
  if (totalProviders > 1) throw new SDKError("Pass only one provider", "core", "VALIDATION_ERROR");

  if (hasGoogle) {
    if (!provider.google!.model.trim()) throw new SDKError("google.model is required", "google", "VALIDATION_ERROR");
    if (!provider.google!.prompt.trim()) throw new SDKError("google.prompt is required", "google", "VALIDATION_ERROR");
  }

  if (hasOpenAI) {
    if (!provider.openai!.model.trim()) throw new SDKError("openai.model is required", "openai", "VALIDATION_ERROR");
    if (!provider.openai!.prompt.trim()) throw new SDKError("openai.prompt is required", "openai", "VALIDATION_ERROR");
  }

  if (hasDeepSeek) {
    if (!provider.deepseek!.model.trim()) throw new SDKError("deepseek.model is required", "deepseek", "VALIDATION_ERROR");
    if (!provider.deepseek!.prompt.trim()) throw new SDKError("deepseek.prompt is required", "deepseek", "VALIDATION_ERROR");
  }

  if (hasMistral) {
    if (!provider.mistral!.model.trim()) throw new SDKError("mistral.model is required", "mistral", "VALIDATION_ERROR");
    if (!provider.mistral!.prompt.trim()) throw new SDKError("mistral.prompt is required", "mistral", "VALIDATION_ERROR");
  }

  if (hasAnthropic) {
    if (!provider.anthropic!.model.trim()) throw new SDKError("anthropic.model is required", "anthropic", "VALIDATION_ERROR");
    if (!provider.anthropic!.prompt.trim()) throw new SDKError("anthropic.prompt is required", "anthropic", "VALIDATION_ERROR");
  }
}

export function validateConfig(sdkConfig: SDKConfig) {
  if (!sdkConfig) {
    throw new SDKError('no providers configured', 'core', 'VALIDATION_ERROR');
  }

  const hasGoogle = !!sdkConfig.google;
  const hasOpenAI = !!sdkConfig.openai;
  const hasDeepSeek = !!sdkConfig.deepseek;
  const hasMistral = !!sdkConfig.mistral;
  const hasAnthropic = !!sdkConfig.anthropic;

  if (!hasGoogle && !hasOpenAI && !hasDeepSeek && !hasMistral && !hasAnthropic) {
    throw new SDKError('no providers configured', 'core', 'VALIDATION_ERROR');
  }

  if (hasGoogle) {
    const key = sdkConfig.google?.apiKey;
    if (typeof key !== 'string' || key.trim().length === 0) {
      throw new SDKError('google.apiKey is required', 'google', 'VALIDATION_ERROR');
    }
  }

  if (hasOpenAI) {
    const key = sdkConfig.openai?.apiKey;
    if (typeof key !== 'string' || key.trim().length === 0) {
      throw new SDKError('openai.apiKey is required', 'openai', 'VALIDATION_ERROR');
    }
  }

  if (hasDeepSeek) {
    const key = sdkConfig.deepseek?.apiKey;
    if (typeof key !== 'string' || key.trim().length === 0) {
      throw new SDKError('deepseek.apiKey is required', 'deepseek', 'VALIDATION_ERROR');
    }
  }

  if (hasMistral) {
    const key = sdkConfig.mistral?.apiKey;
    if (typeof key !== 'string' || key.trim().length === 0) {
      throw new SDKError('mistral.apiKey is required', 'mistral', 'VALIDATION_ERROR');
    }
  }

  if (hasAnthropic) {
    const key = sdkConfig.anthropic?.apiKey;
    if (typeof key !== 'string' || key.trim().length === 0) {
      throw new SDKError('anthropic.apiKey is required', 'anthropic', 'VALIDATION_ERROR');
    }
  }
}

