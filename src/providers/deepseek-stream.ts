import type { Provider, StreamOutput } from '../types/types';
import { SDKError } from '../core/error';

export async function* deepseekStreamProvider(
  provider: Provider,
  apiKey: string,
): AsyncGenerator<StreamOutput> {
  if (!provider.deepseek) {
    throw new SDKError('deepseek provider config missing', 'deepseek', 'CONFIG_ERROR');
  }

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
      temperature: provider.deepseek.temperature,
      max_tokens: provider.deepseek.maxTokens,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    let message = `Deepseek streaming error ${res.status}`;
    try {
      const errJson = await res.json();
      message = errJson?.error?.message ?? message;
    } catch {
      // ignore JSON parse failures here
    }
    throw new SDKError(message, 'deepseek', 'API_ERROR');
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

       // DeepSeek streaming format: choices[0].delta.content
       const text = event.choices?.[0]?.delta?.content ?? '';

       const output: StreamOutput = {
         text,
         done: event.choices?.[0]?.finish_reason === 'stop',
         tokens: event.usage
           ? {
               prompt: event.usage.prompt_tokens,
               completion: event.usage.completion_tokens,
               total: event.usage.prompt_tokens + event.usage.completion_tokens,
             }
           : undefined,
         raw: event,
         provider: 'deepseek',
       };

       yield output;
    }
  }
}