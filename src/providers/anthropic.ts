import type { Provider, Output } from '../types/types';
import { SDKError } from '../core/error';

export async function anthropicProvider(provider: Provider, apiKey: string): Promise<Output> {
  if (!provider.anthropic) {
    throw new SDKError('anthropic provider config missing', 'anthropic', 'CONFIG_ERROR');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: provider.anthropic.model,
      max_tokens: provider.anthropic.maxTokens ?? 1024,
      messages: [
        { role: 'user', content: provider.anthropic.prompt },
      ],
      temperature: provider.anthropic.temperature,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new SDKError(`Anthropic error ${res.status}: ${JSON.stringify(data)}`, 'anthropic', 'API_ERROR');
  }

  const text =
    data.content?.[0]?.text ??
    data.output_text ??
    data.output?.[0]?.content?.map((c: any) => c.text).join('') ??
    '';

  if (provider.anthropic.raw === true) {
    return {
      data: text,
      provider: 'anthropic',
      model: provider.anthropic.model,
      raw: data,
    };
  }

  return {
    data: text,
    provider: 'anthropic',
    model: provider.anthropic.model,
  };
}
