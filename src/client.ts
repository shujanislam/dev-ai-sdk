import type { Provider } from './types/types';
import { googleProvider } from './providers/google';

export class genChat{
  async googleGenerate(provider: Provider): Promise<string> {
    const result = await googleProvider(provider); 

    return result;
  }
}
