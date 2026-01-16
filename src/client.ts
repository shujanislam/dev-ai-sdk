import type { Provider, Output } from './types/types';
import { googleProvider } from './providers/google';
import { openaiProvider } from './providers/openai';
import { deepseekProvider } from './providers/deepseek';
import { mistralProvider } from './providers/mistral';
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
 
  async generate(provider: Provider): Promise<Output> {
    validateProvider(provider);
    
    try {
      if (provider.google) {
        return await googleProvider(provider, this.sdkConfig.google!.apiKey);
      }
 
      if (provider.openai) {
        return await openaiProvider(provider, this.sdkConfig.openai!.apiKey);
      }
 
      if (provider.deepseek) {
        return await deepseekProvider(provider, this.sdkConfig.deepseek!.apiKey);
      }
 
      if (provider.mistral) {
        return await mistralProvider(provider, this.sdkConfig.mistral!.apiKey);
      }

      throw new SDKError('No provider passed', 'core');
    } catch (err) {
      if (err instanceof SDKError && this.sdkConfig.fallback === true) {
        // try other configured providers via fallback engine
        return await fallbackEngine(err.provider, this.sdkConfig, provider);
      }
      else{
        throw err;
      }
    }
  }


}

