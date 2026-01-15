import type { Provider } from './types/types';
import { googleProvider } from './providers/google';
import { openaiProvider } from './providers/openai';
import { SDKError } from './core/error';
import { validateProvider } from './core/validate';

export class genChat{
  apiKey: string;

  constructor(apiKey: string) {
    if(apiKey == null || apiKey.length < 1 || !apiKey){
      throw new SDKError('API key is missing');
    }
    
    this.apiKey = apiKey; 
  }

  async googleGenerate(provider: Provider): Promise<string> {
    validateProvider(provider);

    const result = await googleProvider(provider, this.apiKey); 

    return result;
    
    return 'working';
  }

  async openaiGenerate(provider: Provider): Promise<string> {
    validateProvider(provider);
    
    const result = await openaiProvider(provider, this.apiKey); 

    return result;
  }
}
