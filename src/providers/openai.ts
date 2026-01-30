import type { Provider, Output } from '../types/types';
import { SDKError } from '../core/error';

export async function openaiProvider(provider: Provider, apiKey: string): Promise<Output> {
  if (!provider.openai) {
    throw new SDKError('openai provider config missing', 'openai', 'CONFIG_ERROR');
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: provider.openai.model,
      input: `${provider.openai.system ?? ''} ${provider.openai.prompt}`,
      temperature: provider.openai.temperature,
      max_output_tokens: provider.openai.maxTokens,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new SDKError(`OpenAI error ${res.status}: ${JSON.stringify(data)}`, 'openai', 'API_ERROR');
  }

  const text =
    data.output_text ??
    data.output?.[0]?.content?.map((c: any) => c.text).join("") ??
    "";

  if (provider.openai.raw === true) {
    return {
      data: text,
      provider: 'openai',
      model: provider.openai.model,
      raw: data,
    };
  }

  return {
    data: text,
    provider: 'openai',
    model: provider.openai.model,
  };
}
