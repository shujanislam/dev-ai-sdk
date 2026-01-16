import { genChat } from './client.ts';

import { SDKError } from './core/error';

const ai = new genChat({
  google: {
    apiKey: 'AIzaSyAw29Z0r1wMYXJzxGVb-J64h_fsESxOX5g',
  }
});

const res = await ai.generate({
  google: {
    model: 'gemini-2.5-flash-lite',
    prompt: 'when is jcoles the fall off album release?',
    maxTokens: 500,
  },
});

console.log(res);

