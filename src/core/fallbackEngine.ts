import type { Provider, Output } from '../types/types';
import { openaiProvider } from '../providers/openai';
import { deepseekProvider } from '../providers/deepseek';
import { mistralProvider } from '../providers/mistral';
import { googleCoreProvider } from '../providers/google-core';
import { SDKError } from './error';
import type { SDKConfig } from './config';
 
export async function fallbackEngine(
  failedProvider: string,
  sdkConfig: SDKConfig,
  originalProvider: Provider,
): Promise<Output> {
  const candidates: Array<'google' | 'openai' | 'deepseek' | 'mistral'> = [];

  if (sdkConfig.google?.apiKey && failedProvider !== 'google') candidates.push('google');
  if (sdkConfig.openai?.apiKey && failedProvider !== 'openai') candidates.push('openai');
  if (sdkConfig.deepseek?.apiKey && failedProvider !== 'deepseek') candidates.push('deepseek');
  if (sdkConfig.mistral?.apiKey && failedProvider !== 'mistral') candidates.push('mistral');

  if (candidates.length === 0) {
    throw new SDKError('No fallback providers configured', 'core', 'FALLBACK_CONFIG_ERROR');
  }

  const sourceConfig =
    originalProvider.google ??
    originalProvider.openai ??
    originalProvider.deepseek ??
    originalProvider.mistral;

  const wasStreaming =
    originalProvider.google?.stream === true ||
    originalProvider.openai?.stream === true ||
    originalProvider.deepseek?.stream === true ||
    originalProvider.mistral?.stream === true;

  if (!sourceConfig) {
    throw new SDKError('No original provider config found for fallback', 'core', 'FALLBACK_CONFIG_ERROR');
  }

  let lastError: unknown;

  for (const candidate of candidates) {
    try {
      const nextProvider: Provider = {};

      if (candidate === 'google') {
        nextProvider.google = {
          model: 'gemini-2.5-flash-lite',
          prompt: sourceConfig.prompt,
          system: sourceConfig.system,
          temperature: sourceConfig.temperature,
          maxTokens: sourceConfig.maxTokens,
          raw: sourceConfig.raw,
        };
        return await googleCoreProvider(nextProvider, sdkConfig.google!.apiKey);
      }

      if (candidate === 'openai') {
        nextProvider.openai = {
          model: 'gpt-5.2',
          prompt: sourceConfig.prompt,
          system: sourceConfig.system,
          temperature: sourceConfig.temperature,
          maxTokens: sourceConfig.maxTokens,
          raw: sourceConfig.raw,
        };
        return await openaiProvider(nextProvider, sdkConfig.openai!.apiKey);
      }

      if (candidate === 'deepseek') {
        nextProvider.deepseek = {
          model: 'deepseek-chat',
          prompt: sourceConfig.prompt,
          system: sourceConfig.system,
          temperature: sourceConfig.temperature,
          maxTokens: sourceConfig.maxTokens,
          raw: sourceConfig.raw,
        };
        return await deepseekProvider(nextProvider, sdkConfig.deepseek!.apiKey);
      }

      if (candidate === 'mistral') {
        nextProvider.mistral = {
          model: 'mistral-tiny',
          prompt: sourceConfig.prompt,
          system: sourceConfig.system,
          temperature: sourceConfig.temperature,
          maxTokens: sourceConfig.maxTokens,
          raw: sourceConfig.raw,
        };
        return await mistralProvider(nextProvider, sdkConfig.mistral!.apiKey);
      }
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  if (lastError instanceof SDKError) {
    throw lastError;
  }

   throw new SDKError('All fallback providers failed', 'core', 'FALLBACK_ALL_FAILED');
}
