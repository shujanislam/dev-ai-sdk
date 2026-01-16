import type { Provider, Output } from '../types/types';
import { SDKError } from '../core/error';

export async function deepseekProvider(provider: Provider, apiKey: string): Promise<Output> {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: provider.deepseek.model,
      messages: [
        {
          role: 'user',
          content: provider.deepseek.prompt,
        },
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new SDKError(`Deepseek error ${res.status}: ${JSON.stringify(data)}`, 'Deepseek');
  }

  const text =
    data.output_text ??
    data.output?.[0]?.content?.map((c: any) => c.text).join("") ??
    "";

  if(provider?.raw === true){
    return {
      text,
      provider: 'deepseek',
      model: provider.deepseek.model,
      raw: data,
    }; 
  }

  return {
    text,
    provider: 'deepseek',
    model: provider.deepseek.model,
  };
}
