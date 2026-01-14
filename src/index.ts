import { genChat } from './client.ts';

import { SDKError } from './core/error';

const ai = new genChat();

// const res = await ai.googleGenerate({
//   model: 'gemini-2.5-flash-lite',
//   apiKey: 'API_KEY',
//   prompt: 'who is the president of usa?'
// });

// const openai = await ai.openaiGenerate({
//   model: 'gpt-4.1-mini',
//   apiKey: 'API_KEY',
//   prompt: 'who is the president of usa?',
// })

try{
  throw new SDKError('who is the president of usa?');
}
catch(e){
  console.log(e.message);
}
