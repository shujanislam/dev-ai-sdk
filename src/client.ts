import type { Provider, Output } from './types/types';
import { googleProvider } from './providers/google';
import { openaiProvider } from './providers/openai';
import { SDKError } from './core/error';
import { validateConfig, validateProvider } from './core/validate';
import type { SDKConfig } from './core/config';

export class genChat{
  private googleApiKey: string;
  private openaiApiKey: string;
  
  constructor(sdkConfig: SDKConfig) {
    validateConfig(sdkConfig);

    if(sdkConfig.google?.apiKey) this.googleApiKey = sdkConfig.google.apiKey;
  
    if(sdkConfig.openai?.apiKey) this.openaiApiKey = sdkConfig.openai.apiKey;
  }

  async generate(provider: Provider): Promise<Output> {
    validateProvider(provider);

    let res: Output;

    if(provider.google) res = await googleProvider(provider, this.googleApiKey);

    if(provider.openai) res = await openaiProvider(provider, this.openaiApiKey);

    return res;
  }
}
