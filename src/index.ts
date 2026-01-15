import { genChat } from './client.ts';

import { SDKError } from './core/error';

const ai = new genChat({
  google: { apiKey: 'AIzaSyA328_DEtYplxiG5v70pp5fcu3oTGA-NvQ' },
});

const res = await ai.googleGenerate({
  model: 'gemini-2.5-flash-lite',
  prompt: 'what is vercel v0?'
});

console.log(res);

// const openai = await ai.openaiGenerate({
//   model: 'gpt-4.1-mini',
//   prompt: 'who is the president of usa?',
// })

