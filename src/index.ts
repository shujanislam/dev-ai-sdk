import { genChat } from './client.ts';

const ai = new genChat();

const res = await ai.googleGenerate({
  model: 'gemini-2.5-flash-lite',
  apiKey: 'API_KEY',
  prompt: 'who is the president of usa?'
});

console.log(res);
