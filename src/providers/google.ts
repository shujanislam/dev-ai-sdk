import type { Provider } from '../types/types';
import { SDKError } from '../core/error';

export async function googleProvider(provider: Provider, apiKey: string): Promise<string> {

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: provider.prompt }],
          },
        ],
      }),
    });

    if(!res.ok){
    throw new SDKError(`Gemini error ${res.status}`, 'Google');
    }

    const data = await res.json();

    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "sorry";
}
