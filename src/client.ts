import type { Provider, Output } from './types/types';
import { googleCoreProvider } from './providers/google-core';
import { googleStreamProvider } from './providers/google-stream';
import { openaiProvider } from './providers/openai';
import { openaiStreamProvider } from './providers/openai-stream';
import { deepseekProvider } from './providers/deepseek';
import { deepseekStreamProvider } from './providers/deepseek-stream';
import { mistralProvider } from './providers/mistral';
import { mistralStreamProvider } from './providers/mistral-stream';
import { SDKError } from './core/error';
import { validateConfig, validateProvider } from './core/validate';
import type { SDKConfig } from './core/config';
import { fallbackEngine } from './core/fallbackEngine';
 
export class genChat{
  private sdkConfig: SDKConfig;
  
  constructor(sdkConfig: SDKConfig) {
    validateConfig(sdkConfig);
 
    this.sdkConfig = {
      google: sdkConfig.google ? { ...sdkConfig.google } : undefined,
      openai: sdkConfig.openai ? { ...sdkConfig.openai } : undefined,
      deepseek: sdkConfig.deepseek ? { ...sdkConfig.deepseek } : undefined,
      mistral: sdkConfig.mistral ? { ...sdkConfig.mistral } : undefined,
      fallback: sdkConfig.fallback,
    };
  }
 
   async generate(provider: Provider): Promise<Output | AsyncGenerator<any>> {
    validateProvider(provider);
    
    try {
      if (provider.google) {
        if (provider.google.stream === true) {
          return googleStreamProvider(provider, this.sdkConfig.google!.apiKey);
        }
        return await googleCoreProvider(provider, this.sdkConfig.google!.apiKey);
      }
 
      if (provider.openai) {
        if (provider.openai.stream === true) {
          return openaiStreamProvider(provider, this.sdkConfig.openai!.apiKey);
        }
        return await openaiProvider(provider, this.sdkConfig.openai!.apiKey);
      }
 
      if (provider.deepseek) {
        if (provider.deepseek.stream === true) {
          return deepseekStreamProvider(provider, this.sdkConfig.deepseek!.apiKey);
        }
        return await deepseekProvider(provider, this.sdkConfig.deepseek!.apiKey);
      }
 
      if (provider.mistral) {
        if (provider.mistral.stream === true) {
          return mistralStreamProvider(provider, this.sdkConfig.mistral!.apiKey);
        }
        return await mistralProvider(provider, this.sdkConfig.mistral!.apiKey);
      }
 
      throw new SDKError('No provider passed', 'core');
    } catch (err) {
      const isStreaming =
        provider.google?.stream === true ||
        provider.openai?.stream === true ||
        provider.deepseek?.stream === true ||
        provider.mistral?.stream === true;

      if (
        !isStreaming &&
        err instanceof SDKError &&
        this.sdkConfig.fallback === true
      ) {
        // non-streaming calls can use fallback engine
        return await fallbackEngine(err.provider, this.sdkConfig, provider);
      }
      
      if (err instanceof SDKError) {
        throw err;
      }
 
      throw new SDKError('Unexpected Error', 'core');
    }
  }
}

