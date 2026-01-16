import type { Provider, Output } from '../types/types';
import { SDKError } from '../core/error';

export async function mistralProvider(provider: Provider, apiKey: string): Promise<Output> {
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: provider.mistral.model,
      messages: [
        {
          role: 'user',
          content: provider.mistral.prompt,
        },
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new SDKError(`Mistral error ${res.status}: ${JSON.stringify(data)}`, 'mistral');
  }

  const text = data.choices?.[0]?.message?.content ?? '';

  if(provider?.raw === true){
    return {
      text,
      provider: 'mistral',
      model: provider.mistral.model,
      raw: data,
    }; 
  }

  return {
    text,
    provider: 'mistral',
    model: provider.mistral.model,
  };
}
