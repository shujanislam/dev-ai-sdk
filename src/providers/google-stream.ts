import type { Provider } from '../types/types';
import { SDKError } from '../core/error';

export async function* googleStreamProvider(
  provider: Provider,
  apiKey: string,
): AsyncGenerator<string> {
  if (!provider.google) {
    throw new SDKError('google provider config missing', 'google');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${provider.google.model}:streamGenerateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${provider.google.system ?? ''} ${provider.google.prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: provider.google.temperature,
          maxOutputTokens: provider.google.maxTokens,
        },
      }),
    },
  );

  if (!res.ok || !res.body) {
    let message = 'Gemini streaming error';
    try {
      const errJson = await res.json();
      message = errJson?.error?.message ?? message;
    } catch {
      // ignore JSON parse errors here
    }
    throw new SDKError(message, 'google');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (chunk) {
      yield chunk;
    }
  }
}
