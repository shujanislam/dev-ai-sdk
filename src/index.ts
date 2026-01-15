import { genChat } from './client.ts';

import { SDKError } from './core/error';

const ai = new genChat({
  google: { apiKey: 'API_KEY' },
});

const res = await ai.googleGenerate({
  model: 'gemini-2.5-flash-lite',
  prompt: 'who is the president of usa?'
});

console.log(res);

// const openai = await ai.openaiGenerate({
//   model: 'gpt-4.1-mini',
//   prompt: 'who is the president of usa?',
// })

