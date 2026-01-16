import { genChat } from './client.ts';

import { SDKError } from './core/error';

import dotenv from 'dotenv';

dotenv.config();

// TODO: IF A MODEL FAILS TO GIVE OUTPUT, FALL BACK TO NEXT MODEL

const ai = new genChat({
  google: {
    apiKey: process.env.GOOGLE_API_KEY,
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
  },
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY,
  }
});

const res = await ai.generate({
  mistral: {
    model: 'mistral-tiny',
    prompt: 'explain vercel in one line',
    // system: 'Act like you are the maker of Vercel and answer accordingly',
    // maxTokens: 500,
  },
});

console.log(res);

