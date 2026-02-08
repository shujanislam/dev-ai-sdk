import type { Provider, Output } from '../types/types';
import { SDKError } from '../core/error';

export async function googleCoreProvider(provider: Provider, apiKey: string): Promise<Output> {
  if (!provider.google) {
    throw new SDKError('google provider config missing', 'google', 'CONFIG_ERROR');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${provider.google.model}:generateContent`,
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

  const rawData = await res.json();

  if (!res.ok) {
    const msg = rawData?.error?.message ?? 'Gemini error';
     throw new SDKError(`Gemini error ${msg}`, 'google', 'API_ERROR');
  }

  const data = rawData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (provider.google.raw === true) {
    return {
      data,
      provider: 'google',
      model: provider.google.model,
      raw: rawData,
    };
  }

  return {
    data,
    provider: 'google',
    model: provider.google.model,
  };
}
