# dev-ai-sdk

Universal AI SDK with a single syntax for multiple LLM providers.

This is an early, minimal version that focuses on a simple "generate text" use case with basic provider routing and validation. It currently supports:

- OpenAI Responses API
- Google Gemini (Generative Language API)

---

## Features

- Unified interface for multiple providers (OpenAI, Google)
- Strongly typed configuration and request/response types
- Centralized validation of configuration and provider calls
- Normalized error type (`SDKError`) with provider tagging
- Tiny, dependency-light TypeScript codebase

Planned (not implemented yet):

- Streaming responses
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
- You call `generate` with exactly one provider payload (`google` or `openai`).
- The client validates the configuration and the request, then calls the appropriate provider adapter.

Key files:

- `src/client.ts` – main `genChat` class
- `src/providers/google.ts` – Google Gemini implementation
- `src/providers/openai.ts` – OpenAI Responses API implementation
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
};
```

Rules:

- At least one provider (`google` or `openai`) must be configured.
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
});
```

---

## Provider Request Shape

Requests are described by the `Provider` type in `src/types/types.ts`:

```ts
export type Provider = {
  google?: {
    model: string;
    prompt: string;
    raw?: boolean;
  };

  openai?: {
    model: string;
    prompt: string;
    raw?: boolean;
  };
};
```

Rules enforced by `validateProvider`:

- Exactly one provider must be present per call:
  - Either `provider.google` or `provider.openai`, but not both.
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
};
```

Fields:

- `data`: the main text content returned by the model (for Google, this is the text from the top candidate; for OpenAI, it is derived from the response content).
- `provider`: the provider identifier (for example, `'google'` or `'openai'`).
- `model`: the model name that was used.
- `raw` (optional): the full raw JSON response from the provider, included only when `raw: true` is set on the request.

> Note: As of now, the underlying provider implementations may use slightly different field names internally (`text` vs `data`), but the public `Output` type documents the intended normalized shape.

---

## Usage

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
});
```

You can also configure only one provider if you prefer:

```ts
const ai = new genChat({
  google: {
    apiKey: process.env.GOOGLE_API_KEY!,
  },
});
```

### 2. Calling Google Gemini

```ts
const result = await ai.generate({
  google: {
    model: 'gemini-2.5-flash-lite',
    prompt: 'Summarize the benefits of TypeScript in 3 bullet points.',
    raw: false, // set to true to include full raw response
  },
});

console.log(result.provider); // 'google'
console.log(result.model);    // 'gemini-2.5-flash-lite'
console.log(result.data);     // summarized text
```

Under the hood (`src/providers/google.ts`):

- The SDK calls the Gemini `generateContent` endpoint:
  - `POST https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
- It sends the prompt as `contents[0].parts[0].text`.
- It extracts the top candidate text at `candidates[0].content.parts[0].text`.
- If `raw: true` is set in the request, the full JSON response is returned in `raw`.

### 3. Calling OpenAI Responses API

```ts
const result = await ai.generate({
  openai: {
    model: 'gpt-4.1-mini',
    prompt: 'Generate a creative product name for a note-taking app.',
    raw: false, // set to true to include full raw response
  },
});

console.log(result.provider); // 'openai'
console.log(result.model);    // 'gpt-4.1-mini'
console.log(result.data);     // generated product name
```

Under the hood (`src/providers/openai.ts`):

- The SDK calls the OpenAI Responses API:
  - `POST https://api.openai.com/v1/responses`
- It sends:
  - `model`: the value you provided.
  - `input`: the `prompt` you provided.
- It attempts to extract a text string from common response formats:
  - `data.output_text`, or
  - `data.output[0].content[].text` joined into one string.
- If `raw: true` is set in the request, the full JSON response is included in `raw`.

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
- API key is missing or an empty string.
- No provider passed to `generate`.
- Both `google` and `openai` passed in a single `generate` call.
- `model` or `prompt` is missing/empty for the chosen provider.
- Provider HTTP response is not OK (`res.ok === false`), in which case the error message includes the status code and response data (for OpenAI) or the error message from Gemini.

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

## Limitations

This project is currently in a very early stage and has several limitations:

- Only single-prompt text generation is supported (no chat/history abstraction yet).
- No streaming APIs are exposed.
- No structured/JSON output helpers are provided.
- No React/Next.js integrations or hooks are included.
- Only OpenAI and Google Gemini are supported.

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