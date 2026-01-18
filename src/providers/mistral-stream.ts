import type { Provider } from '../types/types';
import { SDKError } from '../core/error';

export async function* mistralStreamProvider(
  provider: Provider,
  apiKey: string,
): AsyncGenerator<string> {
  if (!provider.mistral) {
    throw new SDKError('mistral provider config missing', 'mistral');
  }

  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
      temperature: provider.mistral.temperature,
      max_tokens: provider.mistral.maxTokens,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    let message = `Mistral streaming error ${res.status}`;
    try {
      const errJson = await res.json();
      message = errJson?.error?.message ?? message;
    } catch {
      // ignore JSON parse failures here
    }
    throw new SDKError(message, 'mistral');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (!line) continue;

      let event: any;
      try {
        event = JSON.parse(line);
      } catch {
        // skip malformed / partial JSON lines
        continue;
      }

      // Mistral streaming format is assumed similar to non-streaming:
      // text in event.choices[0].message.content or delta content
      const text =
        event.choices?.[0]?.message?.content ?? '';

      if (text) {
        yield text;
      }
    }
  }
}