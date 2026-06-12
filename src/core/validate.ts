import type { Provider, ToolConfig } from '../types/types';
import type { SDKConfig } from './config';
import { SDKError } from './error';

function validateTools(tools: ToolConfig[] | undefined, provider: string) {
  if (!tools) return;

  if (!Array.isArray(tools)) {
    throw new SDKError(`${provider}.tool must be an array`, provider, 'VALIDATION_ERROR');
  }

  const names = new Set<string>();

  tools.forEach((tool, index) => {
    if (!tool.name?.trim()) {
      throw new SDKError(`${provider}.tool[${index}].name is required`, provider, 'VALIDATION_ERROR');
    }

    if (names.has(tool.name)) {
      throw new SDKError(`${provider}.tool contains duplicate tool name: ${tool.name}`, provider, 'VALIDATION_ERROR');
    }

    names.add(tool.name);

    if (!tool.description?.trim()) {
      throw new SDKError(`${provider}.tool[${index}].description is required`, provider, 'VALIDATION_ERROR');
    }

    if (!tool.parameters || typeof tool.parameters !== 'object' || Array.isArray(tool.parameters)) {
      throw new SDKError(`${provider}.tool[${index}].parameters must be an object`, provider, 'VALIDATION_ERROR');
    }

    if (typeof tool.execute !== 'function') {
      throw new SDKError(`${provider}.tool[${index}].execute must be a function`, provider, 'VALIDATION_ERROR');
    }
  });
}

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
    validateTools(provider.google!.tool, 'google');
  }

  if (hasOpenAI) {
    if (!provider.openai!.model.trim()) throw new SDKError("openai.model is required", "openai", "VALIDATION_ERROR");
    if (!provider.openai!.prompt.trim()) throw new SDKError("openai.prompt is required", "openai", "VALIDATION_ERROR");
    validateTools(provider.openai!.tool, 'openai');
  }

  if (hasDeepSeek) {
    if (!provider.deepseek!.model.trim()) throw new SDKError("deepseek.model is required", "deepseek", "VALIDATION_ERROR");
    if (!provider.deepseek!.prompt.trim()) throw new SDKError("deepseek.prompt is required", "deepseek", "VALIDATION_ERROR");
    validateTools(provider.deepseek!.tool, 'deepseek');
  }

  if (hasMistral) {
    if (!provider.mistral!.model.trim()) throw new SDKError("mistral.model is required", "mistral", "VALIDATION_ERROR");
    if (!provider.mistral!.prompt.trim()) throw new SDKError("mistral.prompt is required", "mistral", "VALIDATION_ERROR");
    validateTools(provider.mistral!.tool, 'mistral');
  }

  if (hasAnthropic) {
    if (!provider.anthropic!.model.trim()) throw new SDKError("anthropic.model is required", "anthropic", "VALIDATION_ERROR");
    if (!provider.anthropic!.prompt.trim()) throw new SDKError("anthropic.prompt is required", "anthropic", "VALIDATION_ERROR");
    validateTools(provider.anthropic!.tool, 'anthropic');
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
