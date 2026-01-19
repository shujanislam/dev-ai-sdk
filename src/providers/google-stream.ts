import type { Provider, StreamOutput } from '../types/types';
import { SDKError } from '../core/error';

export async function* googleStreamProvider(
  provider: Provider,
  apiKey: string,
): AsyncGenerator<StreamOutput> {
  if (!provider.google) {
    throw new SDKError('google provider config missing', 'google');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${provider.google.model}:streamGenerateContent`,
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

  if (!res.ok || !res.body) {
    let message = 'Gemini streaming error';
    try {
      const errJson = await res.json();
      message = errJson?.error?.message ?? message;
    } catch {
      // ignore JSON parse errors here
    }
    throw new SDKError(message, 'google');
  }

   const reader = res.body.getReader();
   const decoder = new TextDecoder();
   let buffer = '';

   for (;;) {
     const { done, value } = await reader.read();
     if (done) break;

     buffer += decoder.decode(value, { stream: true });

     // Try to extract complete JSON objects from buffer
     let start = buffer.indexOf('[');
     let end = -1;

     if (start !== -1) {
       // Find matching closing bracket
       let bracketCount = 0;
       for (let i = start; i < buffer.length; i++) {
         if (buffer[i] === '[') bracketCount++;
         if (buffer[i] === ']') {
           bracketCount--;
           if (bracketCount === 0) {
             end = i;
             break;
           }
         }
       }

       // If we found a complete JSON array
       if (end !== -1) {
         const jsonPart = buffer.slice(start, end + 1);

         try {
           const events = JSON.parse(jsonPart);

           // events should be an array of streaming event objects
           if (Array.isArray(events)) {
              for (const event of events) {
               const text = event.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
               
               const usage = event.usageMetadata;

               const output: StreamOutput = {
                 text,
                 done: event.candidates?.[0]?.finishReason === 'STOP',
                 tokens: usage
                 ? {
                     prompt: usage.promptTokenCount,
                     completion: usage.candidatesTokenCount,
                     total: usage.totalTokenCount,
                 } : undefined,
                 raw: event,
                 provider: 'google',
               };
                yield output;
              }
           }

           // Remove processed JSON from buffer
           buffer = buffer.slice(end + 1);
         } catch (err) {
           console.error('Failed to parse Google stream JSON:', (err as Error).message);
           // Skip this malformed JSON and try to recover
           buffer = buffer.slice(end + 1);
         }
       }
     }
   }

   // Process any remaining buffer at the end
   if (buffer.trim()) {
     const start = buffer.indexOf('[');
     const end = buffer.lastIndexOf(']');

     if (start !== -1 && end !== -1 && end > start) {
       const jsonPart = buffer.slice(start, end + 1);

       try {
         const events = JSON.parse(jsonPart);

         if (Array.isArray(events)) {
            for (const event of events) {
               const text = event.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
               
               const usage = event.usageMetadata;

               const output: StreamOutput = {
                 text,
                 done: event.candidates?.[0]?.finishReason === 'STOP',
                 tokens: usage
                 ? {
                     prompt: usage.promptTokenCount,
                     completion: usage.candidatesTokenCount,
                     total: usage.totalTokenCount,
                 } : undefined,
                 raw: event,
                 provider: 'google',
               };
             yield output;
            }
         }
       } catch (err) {
         console.error('Failed to parse final Google stream buffer:', (err as Error).message);
       }
     }
   }
 }
