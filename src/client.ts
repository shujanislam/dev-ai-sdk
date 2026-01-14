import type { Provider } from './types/types';
import { googleProvider } from './providers/google';
import { openaiProvider } from './providers/openai';

export class genChat{
  async googleGenerate(provider: Provider): Promise<string> {
    const result = await googleProvider(provider); 

    return result;
  }

  async openaiGenerate(provider: Provider): Promise<string> {
    const result = await openaiProvider(provider); 

    return result;
  }
}
