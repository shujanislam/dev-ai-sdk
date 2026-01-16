import { genChat } from './client.ts';

import { SDKError } from './core/error';

const ai = new genChat({
  google: {
    apiKey: 'API_KEY',
  }
});

const res = await ai.generate({
  google: {
    model: 'gemini-2.5-flash-lite',
    prompt: 'explain typescript in one line',
    system: 'Act like you are the maker of Typescript and answer accordingly',
    maxTokens: 500,
  },
});

console.log(res);

