import type { Provider, StreamOutput } from '../types/types';
import { SDKError } from '../core/error';

export async function* openaiStreamProvider(
  provider: Provider,
  apiKey: string,
): AsyncGenerator<StreamOutput> {
  if (!provider.openai) {
    throw new SDKError('openai provider config missing', 'openai');
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: provider.openai.model,
      input: `${provider.openai.system ?? ''} ${provider.openai.prompt}`,
      temperature: provider.openai.temperature,
      max_output_tokens: provider.openai.maxTokens,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    let message = `OpenAI streaming error ${res.status}`;
    try {
      const errJson = await res.json();
      message = errJson?.error?.message ?? message;
    } catch {
      // ignore JSON parse failures here
    }
    throw new SDKError(message, 'openai');
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

       // OpenAI Responses streaming format: text chunks can appear in
       // event.output[0].content[*].text or event.output_text.
       const text =
         event.output_text ??
         (event.output?.[0]?.content
           ?.map((c: any) => (typeof c.text === 'string' ? c.text : ''))
           .join('') ?? '');

       const output: StreamOutput = {
         text,
         done: event.output_text !== undefined || event.output?.[0]?.content !== undefined,
         tokens: undefined,
         raw: event,
         provider: 'openai',
       };

       yield output;
    }
  }
}