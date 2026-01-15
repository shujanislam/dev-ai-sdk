import type { Provider } from './types/types';
import { googleProvider } from './providers/google';
import { openaiProvider } from './providers/openai';
import { SDKError } from './core/error';
import { validateProvider } from './core/validate';
import type { SDKConfig } from './core/config';

export class genChat{
  private googleApiKey: string;
  private openaiApiKey: string;
  
  constructor(sdkConfig: SDKConfig) {
    if(!sdkConfig) throw new SDKError('no providers configured', 'core');

    if(sdkConfig.google?.apiKey) this.googleApiKey = sdkConfig.google.apiKey;
  
    if(sdkConfig.openai?.apiKey) this.openaiApiKey = sdkConfig.openai.apiKey;
  }

  async googleGenerate(provider: Provider): Promise<string> {
    validateProvider(provider);

    const result = await googleProvider(provider, this.googleApiKey); 

    return result;
  }

  async openaiGenerate(provider: Provider): Promise<string> {
    validateProvider(provider);
    
    const result = await openaiProvider(provider, this.openaiApiKey); 

    return result;
  }
}
