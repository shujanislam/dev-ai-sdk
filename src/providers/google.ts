import type { Provider, Output } from '../types/types';
import { SDKError } from '../core/error';

export async function googleProvider(provider: Provider, apiKey: string): Promise<Output> {

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${provider.google.model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${provider.google.system ?? ''} ${provider.google.prompt}` }],
          },
        ],
        generationConfig: {
          temperature: provider.google.temperature,
          maxOutputTokens: provider.google.maxToken,
        },
      }),
    });

   const raw_data = await res.json();
   
  if(!res.ok){
    const msg = raw_data?.error?.message ?? `Gemini error`; 
    throw new SDKError(`Gemini error ${msg}`, 'google');
   }

    const data = raw_data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''; 


   if(provider?.raw === true){
     return {
       data,
       provider: 'google',
       model: provider.google.model,
       raw: raw_data,
     }; 
   }

   return {
     data,
     provider: 'google',
     model: provider.google.model,
   };
}
