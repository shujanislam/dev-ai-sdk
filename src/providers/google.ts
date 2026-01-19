import type { Provider, Output, StreamOutput } from '../types/types';
import { googleCoreProvider } from './google-core';
import { googleStreamProvider } from './google-stream';

// Backwards-compatible wrapper: chooses streaming or core provider
export async function googleProvider(
  provider: Provider,
  apiKey: string,
): Promise<Output | AsyncIterable<StreamOutput>> {
  if (provider.google && provider.google.stream === true) {
    return googleStreamProvider(provider, apiKey);
  }
  return googleCoreProvider(provider, apiKey);
}
