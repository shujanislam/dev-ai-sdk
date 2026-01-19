// export { genChat } from './client';
// export type { SDKConfig } from './core/config';
// export type { Provider, Output } from './types/types';
// export type { SDKError } from './core/error';

import { genChat } from './client';
import { dotenv } from 'dotenv';

dotenv.config();

const hello = async() => {

const ai = new genChat({
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY, 
  },
  google: {
      apiKey: process.env.GOOGLE_API_KEY,
  },
});

  const stream = await ai.generate({
    google: {
      model: 'gemini-2.5-flash',
      prompt: 'vercel in one small paragraph',
      // maxTokens: 500,
      stream: true,
    }
  });

   if (Symbol.asyncIterator in Object(stream)) {
     for await (const chunk of stream as AsyncGenerator<any>) {
       if (chunk.candidates?.[0]?.content?.parts?.[0]?.text) {
         process.stdout.write(chunk.candidates[0].content.parts[0].text);
       }
     }
     console.log('\n');
   }
}

hello();
