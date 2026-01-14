import type { Provider } from '../types/types';

export async function openaiProvider(provider: Provider): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model: provider.model,
      input: provider.prompt,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`OpenAI error ${res.status}: ${JSON.stringify(data)}`);
  }

  const text =
    data.output_text ??
    data.output?.[0]?.content?.map((c: any) => c.text).join("") ??
    "";

  return text;
}
