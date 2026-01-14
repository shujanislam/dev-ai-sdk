import type { Provider } from '../types/types';

export async function googleProvider(provider: Provider): Promise<string> {

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": provider.apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: provider.prompt }],
          },
        ],
      }),
    });

    const data = await res.json();

    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "sorry";
}
