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
    throw new SDKError(`Mistral error ${res.status}: ${JSON.stringify(data)}`, 'Mistral');
  }

  // const text =
  //   data.output_text ??
  //   data.output?.[0]?.content?.map((c: any) => c.text).join("") ??
  //   "";
  //
  // if(provider?.raw === true){
  //   return {
  //     text,
  //     provider: 'deepseek',
  //     model: provider.deepseek.model,
  //     raw: data,
  //   }; 
  // }

  const text = data.choices?.[0]?.message?.content;

  return {
    text,
    provider: 'mistral',
    model: provider.mistral.model,
  };
}
