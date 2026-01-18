import { genChat } from './client.ts';
 
import dotenv from 'dotenv';
 
dotenv.config();
 
const ai = new genChat({
  google: {
    apiKey: process.env.GOOGLE_API_KEY!,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY!,
  },
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY!,
  },
  // fallback: true,
});
 
// Streaming example
const streamResult = await ai.generate({
  google: {
    model: 'gemini-2.5-flash-lite',
    prompt: 'explain vercel in 5 lines',
    system: 'Act like you are the maker of Vercel and answer accordingly',
    maxTokens: 500,
    stream: true,
  },
});

if (!(Symbol.asyncIterator in Object(streamResult))) {
  throw new Error('Expected streaming result to be async iterable');
}

for await (const chunk of streamResult as AsyncIterable<string>) {
  console.log(chunk.candidates);
}

