# dev-ai-sdk

**A unified TypeScript SDK for using multiple AI providers with one simple interface.**

Stop juggling different API docs and client libraries. `dev-ai-sdk` lets you switch between OpenAI, Google Gemini, DeepSeek, and Mistral with zero code changes.

---

## What It Does

Write once, run anywhere. This SDK provides a consistent interface for text generation across multiple LLM providers:

- **OpenAI** (GPT models via Responses API)
- **Google Gemini** (Gemini models)
- **DeepSeek** (DeepSeek chat models)
- **Mistral** (Mistral models)

Switch providers, change models, or even combine multiple providers — your code stays the same.

---

## Quick Start

### Installation

```bash
npm install dev-ai-sdk
```

### 5-Minute Example

```ts
import { genChat } from 'dev-ai-sdk';

// 1. Create a client with your API keys
const ai = new genChat({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
});

// 2. Generate text
const result = await ai.generate({
  openai: {
    model: 'gpt-4o-mini',
    prompt: 'What is the capital of France?',
  },
});

// 3. Use the result
console.log(result.data); // "The capital of France is Paris."
console.log(result.provider); // "openai"
console.log(result.model); // "gpt-4o-mini"
```

That's it. No complex setup, no provider-specific boilerplate.

---

## Features

✅ **Single Interface** – Same code works across 4 major LLM providers  
✅ **Type-Safe** – Full TypeScript support with proper types  
✅ **Minimal** – Tiny, lightweight package (15KB gzipped)  
✅ **Streaming** – Built-in streaming support for all providers  
✅ **Error Handling** – Unified error handling across all providers  
✅ **No Dependencies** – Only `dotenv` for environment variables  

---

## Usage Guide

### Initialize the Client

```ts
import { genChat } from 'dev-ai-sdk';

const ai = new genChat({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  google: {
    apiKey: process.env.GOOGLE_API_KEY,
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
  },
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY,
  },
});
```

You don't need to configure all providers — just the ones you use.

---

### Basic Text Generation

#### OpenAI

```ts
const result = await ai.generate({
  openai: {
    model: 'gpt-4o-mini',
    prompt: 'Explain quantum computing in one sentence.',
    temperature: 0.7,
    maxTokens: 100,
  },
});

console.log(result.data); // The AI's response
```

#### Google Gemini

```ts
const result = await ai.generate({
  google: {
    model: 'gemini-2.5-flash-lite',
    prompt: 'What are the three laws of robotics?',
    temperature: 0.5,
    maxTokens: 200,
  },
});

console.log(result.data);
```

#### DeepSeek

```ts
const result = await ai.generate({
  deepseek: {
    model: 'deepseek-chat',
    prompt: 'Explain machine learning like I\'m 5.',
    temperature: 0.6,
    maxTokens: 150,
  },
});

console.log(result.data);
```

#### Mistral

```ts
const result = await ai.generate({
  mistral: {
    model: 'mistral-small-latest',
    prompt: 'Tell me a joke about programming.',
    temperature: 0.8,
    maxTokens: 100,
  },
});

console.log(result.data);
```

---

### Streaming Responses

Get real-time responses for long outputs. Streaming returns **full event objects** with access to all metadata:

#### Google Gemini Streaming

```ts
const stream = await ai.generate({
  google: {
    model: 'gemini-2.5-flash-lite',
    prompt: 'Write a 500-word essay on AI ethics.',
    stream: true,
  },
});

if (Symbol.asyncIterator in Object(stream)) {
  for await (const event of stream) {
    // Access the streamed text
    const text = event.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) process.stdout.write(text);
    
    // Access metadata from the same event
    if (event.usageMetadata) {
      console.log(`Tokens: prompt=${event.usageMetadata.promptTokenCount}, output=${event.usageMetadata.candidatesTokenCount}`);
    }
  }
}
```

#### OpenAI Streaming

```ts
const stream = await ai.generate({
  openai: {
    model: 'gpt-4o-mini',
    prompt: 'Write a 500-word essay on AI ethics.',
    stream: true,
  },
});

if (Symbol.asyncIterator in Object(stream)) {
  for await (const event of stream) {
    // Access the streamed text
    const text = event.choices?.[0]?.delta?.content;
    if (text) process.stdout.write(text);
    
    // Access finish reason
    if (event.choices?.[0]?.finish_reason) {
      console.log(`Finished: ${event.choices[0].finish_reason}`);
    }
  }
}
```

#### DeepSeek & Mistral Streaming

```ts
const stream = await ai.generate({
  deepseek: {
    model: 'deepseek-chat',
    prompt: 'Write a poem...',
    stream: true,
  },
});

if (Symbol.asyncIterator in Object(stream)) {
  for await (const event of stream) {
    const text = event.choices?.[0]?.delta?.content || event.choices?.[0]?.message?.content;
    if (text) process.stdout.write(text);
  }
}
```

---

### System Prompts

Give the AI context and instructions:

```ts
const result = await ai.generate({
  openai: {
    model: 'gpt-4o-mini',
    system: 'You are a helpful coding assistant. Always provide code examples.',
    prompt: 'How do I sort an array in JavaScript?',
  },
});

console.log(result.data);
```

---

### Temperature & Max Tokens

Control response behavior:

```ts
const result = await ai.generate({
  openai: {
    model: 'gpt-4o-mini',
    prompt: 'Generate a creative story title.',
    temperature: 0.9, // Higher = more creative/random (0-1)
    maxTokens: 50, // Limit response length
  },
});

console.log(result.data);
```

---

### Get Raw API Responses

Sometimes you need the full provider response:

```ts
const result = await ai.generate({
  google: {
    model: 'gemini-2.5-flash-lite',
    prompt: 'What is 2+2?',
    raw: true,
  },
});

console.log(result.raw); // Full Google API response
console.log(result.data); // Just the text
```

---

## Configuration Reference

### Response Object

Every call returns this shape (for non-streaming):

```ts
{
  data: string;        // The AI's text response
  provider: string;    // Which provider was used (e.g., "openai")
  model: string;       // Which model was used (e.g., "gpt-4o-mini")
  raw?: any;          // (Optional) Full raw API response if raw: true
}
```

### Request Parameters

All providers support:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `model` | string | ✅ | — | Model name (e.g., `gpt-4o-mini`, `gemini-2.5-flash-lite`) |
| `prompt` | string | ✅ | — | Your question or instruction |
| `system` | string | ❌ | — | System context/role for the AI |
| `temperature` | number | ❌ | 1 | Randomness (0 = deterministic, 2 = very creative) |
| `maxTokens` | number | ❌ | — | Max response length in tokens |
| `stream` | boolean | ❌ | false | Stream responses in real-time |
| `raw` | boolean | ❌ | false | Include full provider response |

---

## Streaming Event Structure

Each streaming event is a full parsed object from the provider. Here's what you get from each:

### Google Gemini Event

```ts
{
  candidates: [
    {
      content: {
        parts: [
          { text: "streaming text chunk here" }
        ],
        role: "model"
      },
      finishReason: "STOP",
      index: 0
    }
  ],
  usageMetadata: {
    promptTokenCount: 8,
    candidatesTokenCount: 25,
    totalTokenCount: 33
  },
  modelVersion: "gemini-2.5-flash"
}
```

### OpenAI Event

```ts
{
  id: "chatcmpl-...",
  object: "chat.completion.chunk",
  created: 1234567890,
  model: "gpt-4o-mini",
  choices: [
    {
      index: 0,
      delta: { content: "streaming text chunk" },
      finish_reason: null
    }
  ]
}
```

### DeepSeek Event

```ts
{
  id: "chatcmpl-...",
  choices: [
    {
      index: 0,
      delta: { content: "streaming text chunk" },
      finish_reason: null
    }
  ],
  usage: {
    prompt_tokens: 10,
    completion_tokens: 5
  }
}
```

### Mistral Event

```ts
{
  id: "...",
  object: "text_completion",
  created: 1234567890,
  model: "mistral-small-latest",
  choices: [
    {
      index: 0,
      message: { content: "streaming text chunk" },
      finish_reason: null
    }
  ]
}
```

---

## Error Handling

All errors are `SDKError` exceptions:

```ts
import { SDKError } from 'dev-ai-sdk';

try {
  const result = await ai.generate({
    openai: {
      model: 'gpt-4o-mini',
      prompt: '',  // Invalid: empty prompt
    },
  });
} catch (err) {
  if (err instanceof SDKError) {
    console.error(`Error from ${err.provider}: ${err.message}`);
  } else {
    console.error('Unexpected error:', err);
  }
}
```

Common errors:
- **Missing API key** – Configure all providers you use
- **Invalid model name** – Check provider documentation for valid models
- **Empty prompt** – Prompt must be a non-empty string
- **Invalid request** – Only pass one provider per request (not multiple)

---

## Environment Setup

Create a `.env` file with your API keys:

```bash
# .env
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
DEEPSEEK_API_KEY=sk-...
MISTRAL_API_KEY=...
```

Then load it in your code:

```ts
import 'dotenv/config';

const ai = new genChat({
  openai: { apiKey: process.env.OPENAI_API_KEY! },
});
```

---

## Common Patterns

### Try Multiple Providers

Switch providers without changing your code:

```ts
const provider = process.env.AI_PROVIDER || 'openai';

const result = await ai.generate({
  [provider]: {
    model: getModelForProvider(provider),
    prompt: 'Hello, AI!',
  },
});
```

### Fallback to Cheaper Model

```ts
try {
  const result = await ai.generate({
    openai: {
      model: 'gpt-4o', // Expensive
      prompt: 'Complex question...',
    },
  });
} catch {
  // Fall back to cheaper model
  const result = await ai.generate({
    openai: {
      model: 'gpt-4o-mini', // Cheaper
      prompt: 'Complex question...',
    },
  });
}
```

### Streaming with Real-Time Updates

A practical example combining streaming with line-by-line display:

```ts
const stream = await ai.generate({
  google: {
    model: 'gemini-2.5-flash-lite',
    prompt: 'Write a haiku about programming...',
    stream: true,
  },
});

if (Symbol.asyncIterator in Object(stream)) {
  for await (const event of stream) {
    const text = event.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      process.stdout.write(text);
    }
  }
  console.log(); // newline when done
}
```

---

## Limitations

This is v0.0.3 — early but functional. Currently:

- Single-turn text generation (no multi-turn conversation history yet)
- Streaming returns full provider event objects (extract what you need)
- No function calling / tool use yet
- No JSON mode / structured output yet

---

## What's Next

Future versions will include:

- Multi-turn conversation management
- Structured output helpers
- Function calling across providers
- Rate limiting & caching
- React/Next.js hooks
- More providers (Anthropic, Azure, etc.)

---

## Support

- **GitHub**: https://github.com/shujanislam/dev-ai-sdk
- **Issues**: https://github.com/shujanislam/dev-ai-sdk/issues
- **Author**: Shujan Islam

---

## License

MIT — Use freely in your projects.
