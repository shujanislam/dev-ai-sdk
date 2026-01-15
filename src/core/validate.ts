import type { Provider } from '../types/types';
import { SDKError } from './error';

export function validateProvider(provider: Provider) {
  if(!provider.model?.trim()) throw new SDKError('model is required'); 
  if(!provider.prompt?.trim()) throw new SDKError('prompt is required');
}
