import type { Provider, Output } from './types/types';
import { googleProvider } from './providers/google';
import { openaiProvider } from './providers/openai';
import { deepseekProvider } from './providers/deepseek';
import { mistralProvider } from './providers/mistral';
import { SDKError } from './core/error';
import { validateConfig, validateProvider } from './core/validate';
import type { SDKConfig } from './core/config';
 
export class genChat{
  private googleApiKey: string;
  private openaiApiKey: string;
  private deepseekApiKey: string;
  private mistralApiKey: string;
  
  constructor(sdkConfig: SDKConfig) {
    validateConfig(sdkConfig);
 
    if(sdkConfig.google?.apiKey) this.googleApiKey = sdkConfig.google.apiKey;
  
    if(sdkConfig.openai?.apiKey) this.openaiApiKey = sdkConfig.openai.apiKey;
 
    if(sdkConfig.deepseek?.apiKey) this.deepseekApiKey = sdkConfig.deepseek.apiKey;

    if(sdkConfig.mistral?.apiKey) this.mistralApiKey = sdkConfig.mistral.apiKey;
  }
 
  async generate(provider: Provider): Promise<Output> {
    validateProvider(provider);
 
    let res: Output;
 
    if(provider.google) res = await googleProvider(provider, this.googleApiKey);
 
    if(provider.openai) res = await openaiProvider(provider, this.openaiApiKey);
 
    if(provider.deepseek) res = await deepseekProvider(provider, this.deepseekApiKey);

    if(provider.mistral) res = await mistralProvider(provider, this.mistralApiKey);
    
    return res;
  }
}

