import type { Provider, Output } from '../types/types';
import { SDKError } from '../core/error';

export async function googleProvider(provider: Provider, apiKey: string): Promise<string> {

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${provider.google.model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: provider.google.prompt }],
          },
        ],
      }),
    });

   if(!res.ok){
     throw new SDKError(`Gemini error ${res.status}`, 'Google');
   }

   const raw_data = await res.json();

    const data = raw_data.candidates?.[0]?.content?.parts?.[0]?.text 


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
