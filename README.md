# dev-ai-sdk

Universal AI SDK with a single syntax for multiple LLM providers.

This project aims to give you a small, provider-agnostic layer for text generation across different APIs using a consistent TypeScript interface.

It is still in an early, experimental phase.

Currently supported providers:

- OpenAI (Responses API)
- Google Gemini (Generative Language API)
- DeepSeek (chat completions, OpenAI-like)
- Mistral (chat completions, OpenAI-like)

---

## Features (Current)

- Unified interface for multiple providers (OpenAI, Google, DeepSeek, Mistral)
- Simple `genChat` client with a single `generate` method
- Strongly typed configuration and request/response types
- Centralized validation of configuration and provider calls
- Basic support for:
  - `system` prompt (per provider)
  - `temperature` and `maxTokens` (per provider)
  - Optional `raw` responses to inspect full provider JSON
- Normalized error type (`SDKError`) with provider tagging
- Tiny, dependency-light TypeScript codebase

Planned (not implemented yet):

- Rich message/chat abstractions
- JSON / structured output helpers
- React / Next.js integrations
- More providers (Anthropic, Azure OpenAI, etc.)

---

## Installation

> This project is not yet published to npm; these instructions assume you are developing or consuming it locally.

Clone the repository and install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Build the TypeScript sources:

```bash
npm run build
```

This outputs compiled files to `dist/` as configured in `package.json`.

---

## Core Concepts

The library exposes a single main client class today: `genChat`.

- You configure the client with API keys for the providers you want to use.
- You call `generate` with exactly one provider payload (`google`, `openai`, `deepseek`, or `mistral`).
- The client validates the configuration and the request, then calls the appropriate provider adapter.

Key files:

- `src/client.ts` – main `genChat` class
- `src/providers/google.ts` – Google Gemini implementation
- `src/providers/openai.ts` – OpenAI Responses API implementation
- `src/providers/deepseek.ts` – DeepSeek chat completions implementation
- `src/providers/mistral.ts` – Mistral chat completions implementation
- `src/core/config.ts` – SDK configuration types
- `src/core/validate.ts` – configuration and provider validation
- `src/core/error.ts` – `SDKError` implementation
- `src/types/types.ts` – request/response types

---

## Configuration

The client is configured via an `SDKConfig` object (defined in `src/core/config.ts`):

```ts
export type SDKConfig = {
  google?: {
    apiKey: string;
  };

  openai?: {
    apiKey: string;
  };

  deepseek?: {
    apiKey: string;
  };

  mistral?: {
    apiKey: string;
  };
};
```

Rules:

- At least one provider (`google`, `openai`, `deepseek`, or `mistral`) must be configured.
- Each configured provider must have a non-empty `apiKey` string.
- If these rules are violated, the SDK throws an `SDKError` from `validateConfig`.

Example configuration:

```ts
import { genChat } from './src/client';

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
});
```

You can also configure only the providers you actually intend to use.

---

## Provider Request Shape

Requests are described by the `Provider` type in `src/types/types.ts`:

```ts
export type Provider = {
  google?: {
    model: string;
    prompt: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
    raw?: boolean;
    stream?: boolean; // stream text from Gemini
  };
 
  openai?: {
    model: string;
    prompt: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
    raw?: boolean;
    stream?: boolean; // stream text from OpenAI
  };
 
  deepseek?: {
    model: string;
    prompt: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
    raw?: boolean;
    stream?: boolean; // stream text from DeepSeek
  };
 
  mistral?: {
    model: string;
    prompt: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
    raw?: boolean;
    stream?: boolean; // stream text from Mistral
  };
}

```

Common fields per provider:

- `model` (**required**) – model name for that provider.
- `prompt` (**required**) – the main user message.
- `system` (optional) – high-level system instruction (currently only passed through if you add support in the provider).
- `temperature` (optional) – sampling temperature (0–2, provider-specific behavior).
- `maxTokens` (optional) – maximum output tokens (provider-specific naming under the hood).
- `raw` (optional) – if `true`, include the full raw provider response in `Output.raw`.

Rules enforced by `validateProvider`:

- Exactly one provider must be present per call:
  - Either `provider.google`, `provider.openai`, `provider.deepseek`, or `provider.mistral`, but not more than one at a time.
- For the selected provider:
  - `model` must be a non-empty string.
  - `prompt` must be a non-empty string.

If these rules are not met, an `SDKError` is thrown.

---

## Response Shape

Responses use the `Output` type from `src/types/types.ts`:

```ts
export type Output = {
  data: string;
  provider: string;
  model: string;
  raw?: any;
}
```

Fields:

- `data`: the main text content returned by the model (extracted from each provider-specific response format).
- `provider`: the provider identifier (for example, `'google'`, `'openai'`, `'deepseek'`, `'mistral'`).
- `model`: the model name that was used.
- `raw` (optional): the full raw JSON response from the provider, included only when `raw: true` is set on the request.

> Note: Internally, some providers may temporarily return `{ text: ... }` instead of `{ data: ... }`, but the long-term intention is to normalize around `data` as the main text field.

---

## Usage

### 0. Streaming vs non-streaming

`genChat.generate` returns either a single `Output` (non-streaming) or an async iterable of chunks (streaming), depending on the per-provider `stream` flag:

- If `stream` is **not** set or `false`, `generate` resolves to an `Output`:
  - `{ data, provider, model, raw? }`.
- If `stream` is `true` for a provider (`google`, `openai`, `deepseek`, or `mistral`), `generate` resolves to an async iterable of chunks:
  - You can use `for await (const chunk of result) { ... }`.
  - For Gemini, each `chunk` is a JSON event; you can drill into `candidates[0].content.parts[0].text` to get only the text.

### 1. Creating the Client

Create a new `genChat` instance with the providers you want to use:

```ts
import { genChat } from './src/client';

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
});
```

You can also configure just one provider, e.g. only Mistral:

```ts
const ai = new genChat({
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY!,
  },
});
```

### 2. Calling Google Gemini

#### Non-streaming

```ts
const result = await ai.generate({
  google: {
    model: 'gemini-2.5-flash-lite',
    prompt: 'Summarize the benefits of TypeScript in 3 bullet points.',
    temperature: 0.4,
    maxTokens: 256,
    raw: false, // set to true to include full raw response
  },
});

console.log(result.provider); // 'google'
console.log(result.model);    // 'gemini-2.5-flash-lite'
console.log(result.data);     // summarized text
```

#### Streaming (Gemini)

```ts
const res = await ai.generate({
  google: {
    model: 'gemini-2.5-flash-lite',
    prompt: 'Explain Vercel in 5 lines.',
    system: 'Act like you are the maker of Vercel and answer accordingly.',
    maxTokens: 500,
    stream: true,
  },
});

if (!(Symbol.asyncIterator in Object(res))) {
  throw new Error('Expected streaming result to be async iterable');
}

for await (const chunk of res as AsyncIterable<any>) {
  const text =
    chunk?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (text) {
    console.log(text); // only the text from each streamed event
  }
}
```

### 3. Calling OpenAI (Responses API)

```ts
const result = await ai.generate({
  openai: {
    model: 'gpt-4.1-mini',
    prompt: 'Generate a creative product name for a note-taking app.',
    temperature: 0.7,
    maxTokens: 128,
    raw: false, // set to true to include full raw response
  },
});

console.log(result.provider); // 'openai'
console.log(result.model);    // 'gpt-4.1-mini'
console.log(result.data);     // generated product name
```

### 4. Calling DeepSeek

```ts
const result = await ai.generate({
  deepseek: {
    model: 'deepseek-chat',
    prompt: 'Explain RAG in simple terms.',
    temperature: 0.5,
    maxTokens: 256,
    raw: true, // include full raw DeepSeek response
  },
});

console.log(result.provider); // 'deepseek'
console.log(result.model);    // 'deepseek-chat'
console.log(result.data);     // explanation text
console.log(result.raw);      // full DeepSeek JSON (for debugging)
```

### 5. Calling Mistral

```ts
const result = await ai.generate({
  mistral: {
    model: 'mistral-tiny',
    prompt: 'Give me a short haiku about TypeScript.',
    temperature: 0.8,
    maxTokens: 64,
    raw: true,
  },
});

console.log(result.provider); // 'mistral'
console.log(result.model);    // 'mistral-tiny'
console.log(result.data);     // haiku text (once the provider normalizes to `data`)
console.log(result.raw);      // full Mistral JSON (for inspecting choices/message)
```

> Note: The provider implementations for DeepSeek and Mistral are still evolving. They are currently focused on basic, URL-based chat completions and raw response inspection while you iterate on the exact output normalization.

---

## Error Handling

All SDK-level errors are represented by the `SDKError` class (`src/core/error.ts`):

```ts
export class SDKError extends Error {
  provider: string;
  message: string;

  constructor(message: string, provider?: string) {
    super(message);
    this.provider = provider;
    this.message = message;
  }
}
```

Examples of when `SDKError` is thrown:

- No providers configured in `SDKConfig`.
- API key is missing or an empty string for a configured provider.
- No provider passed to `generate`.
- More than one provider passed in a single `generate` call.
- `model` or `prompt` is missing/empty for the chosen provider.
- Provider HTTP response is not OK (`res.ok === false`), in which case the error message includes the status code and response data.

You can catch and inspect `SDKError` like this:

```ts
try {
  const result = await ai.generate({
    google: {
      model: 'gemini-2.5-flash-lite',
      prompt: '', // invalid: empty prompt
    },
  });
} catch (err) {
  if (err instanceof SDKError) {
    console.error('SDK error from provider:', err.provider);
    console.error('Message:', err.message);
  } else {
    console.error('Unknown error:', err);
  }
}
```

---

## Development

### Scripts

Defined in `package.json`:

- `npm run dev` – run `src/index.ts` with `tsx`.
- `npm run build` – run TypeScript compiler (`tsc`).
- `npm run start` – run the built `dist/index.js` with Node.
- `npm run clean` – remove the `dist` directory.

### TypeScript Configuration

`tsconfig.json` is set up with:

- `target`: `ES2022`
- `module`: `ESNext`
- `moduleResolution`: `Bundler`
- `strict`: `true`
- `allowImportingTsExtensions`: `true`
- `noEmit`: `true` (for development; the build step can be adjusted as the project evolves)

The `src/` directory is included for compilation.

---

## Limitations (Current)

This project is currently in an early stage and has several limitations:
 
- Only single-prompt text generation is supported (no explicit chat/history abstraction yet).
- Streaming is basic and low-level:
  - It returns provider-specific JSON events (for example, Gemini `candidates[].content.parts[].text`).
  - You are responsible for extracting the text you care about from each chunk.
- No structured/JSON output helpers are provided.
- No React/Next.js integrations or hooks are included.
- Output normalization across providers (e.g. always using `data`) is still being finalized.


These limitations are intentional for now to keep the core small and focused while the API surface is still evolving.

---

## Future Directions

The long-term goal is to move toward a feature set closer to the Vercel AI SDK, while staying provider-agnostic and simple. Potential future improvements include:

- `generateText`, `streamText`, and `generateObject` helper functions.
- Unified message-based chat interface and history management.
- First-class streaming support with helpers for Node, browser, and Edge runtimes.
- JSON/structured output helpers, with optional schema validation.
- Tool/function calling abstraction across providers.
- Middleware/hooks for logging, metrics, retries, rate limiting, and caching.
- Official React/Next.js integrations and example apps.
- Support for more providers (Anthropic, Azure OpenAI, etc.).

Contributions and ideas are welcome as the design evolves.
