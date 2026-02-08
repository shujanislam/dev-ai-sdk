# dev-ai-sdk

**A unified TypeScript SDK for using multiple AI providers with one simple interface.**

Stop juggling different API docs and client libraries. `dev-ai-sdk` lets you switch between OpenAI, Google Gemini, DeepSeek, Mistral, and Anthropic Claude with zero code changes. Supports streaming, automatic fallback, and multi-model LLM councils.

---

## What It Does

Write once, run anywhere. This SDK provides a consistent interface for text generation across multiple LLM providers:

- **OpenAI** (GPT models via Chat Completions API)
- **Google Gemini** (Gemini models)
- **DeepSeek** (DeepSeek chat models)
- **Mistral** (Mistral models)
- **Anthropic Claude** (Claude 3/3.5 models)

Switch providers, change models, or even combine multiple providers — your code stays the same. Bonus features: streaming, automatic fallback to other providers, and LLM councils for multi-model decision making.

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

✅ **Single Interface** – Same code works across 5 major LLM providers  
✅ **Type-Safe** – Full TypeScript support with proper types  
✅ **Minimal** – Tiny, lightweight package (15KB gzipped)  
✅ **Streaming** – Built-in streaming support for all providers  
✅ **Automatic Fallback** – If a provider fails, automatically try others  
✅ **LLM Council** – Run multiple models in parallel, have a judge synthesize the best answer  
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
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
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

#### Anthropic Claude

```ts
const result = await ai.generate({
  anthropic: {
    model: 'claude-3-5-sonnet-20241022',
    prompt: 'What is the meaning of life?',
    temperature: 0.7,
    maxTokens: 150,
  },
});

console.log(result.data);
```

---

### Streaming Responses

Get real-time responses for long outputs. All providers return a unified `StreamOutput` format:

```ts
import { genChat, type StreamOutput } from 'dev-ai-sdk';

const stream = await ai.generate({
  google: {
    model: 'gemini-2.5-flash',
    prompt: 'Write a 500-word essay on AI ethics.',
    stream: true,
  },
});

// Check if result is a stream
if (Symbol.asyncIterator in Object(stream)) {
  // Loop through streaming chunks - same pattern for all 4 providers
  for await (const chunk of stream as AsyncIterable<StreamOutput>) {
    // chunk is a StreamOutput with unified structure:
    // - chunk.text: the streamed text content
    // - chunk.done: boolean indicating if stream is complete
    // - chunk.provider: 'google' | 'openai' | 'deepseek' | 'mistral'
    // - chunk.tokens?: { prompt?, completion?, total? } (if available from provider)
    // - chunk.raw: raw provider event for advanced use

    process.stdout.write(chunk.text);

    // Show metadata when stream is done
    if (chunk.done) {
      console.log('\nStream completed');
      console.log(`Provider: ${chunk.provider}`);
      if (chunk.tokens) {
        console.log(`Tokens used: ${chunk.tokens.total}`);
      }
    }
  }
}
```

**Why `StreamOutput`?**

- **Unified API** – Same code works for all 5 providers
- **Consistent fields** – Always access `chunk.text`, never worry about provider-specific paths
- **Access to metadata** – Token counts, completion status, and provider name
- **Raw access** – `chunk.raw` gives you the full provider event if you need it

---

## Automatic Fallback

If a provider fails, automatically retry with other configured providers:

```ts
const ai = new genChat({
  openai: { apiKey: process.env.OPENAI_API_KEY },
  google: { apiKey: process.env.GOOGLE_API_KEY },
  fallback: true, // Enable automatic fallback
});

// Try OpenAI first; if it fails, automatically try Google
const result = await ai.generate({
  openai: {
    model: 'gpt-4o-mini',
    prompt: 'What is 2+2?',
  },
});

console.log(result.provider); // "openai" or "google" depending on which succeeded
console.log(result.data);
```

**How Fallback Works:**
1. First, attempt the configured provider (e.g., OpenAI)
2. If it fails with a retryable error (network, timeout, rate limit), try the next provider
3. Each fallback provider uses a sensible default model for that provider (e.g., `gemini-2.5-flash-lite` for Google)
4. If all providers fail, throw an error
5. **Note:** Streaming calls (`stream: true`) do not trigger fallback; only non-streaming calls can fall back

**Limitations:**
- Fallback is disabled for streaming responses
- Only retryable errors trigger fallback (not validation/config errors)
- Each fallback attempt uses provider-specific default models

---

## LLM Council

Run the same prompt across multiple models and have a judge synthesize the best answer:

```ts
import { genChat, type CouncilDecision } from 'dev-ai-sdk';

const ai = new genChat({
  openai: { apiKey: process.env.OPENAI_API_KEY },
  google: { apiKey: process.env.GOOGLE_API_KEY },
  mistral: { apiKey: process.env.MISTRAL_API_KEY },
  anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
});

// Run same prompt across 3 models, judge with OpenAI
const decision = await ai.councilGenerate({
  members: [
    {
      google: { model: 'gemini-2.5-flash-lite' },
    },
    {
      mistral: { model: 'mistral-small-latest' },
    },
    {
      anthropic: { model: 'claude-3-5-sonnet-20241022' },
    },
  ],
  judge: {
    openai: { model: 'gpt-4o-mini' },
  },
  prompt: 'What are the top 3 programming languages for 2025 and why?',
  system: 'You are an expert in technology trends.',
});

console.log(decision.finalAnswer); // Judge's synthesis of all member responses
console.log(decision.memberResponses); // All individual model outputs
console.log(decision.reasoning); // Judge's reasoning for the final answer
```

**Council Response Structure:**

```ts
type CouncilDecision = {
  finalAnswer: string;        // Judge's final synthesized answer
  memberResponses: {
    [key: string]: string;    // Each member's response by provider name
  };
  reasoning: string;          // Judge's reasoning
  judge: {
    provider: string;         // Judge provider (e.g., "openai")
    model: string;           // Judge model
  };
  members: {
    provider: string;        // Member provider
    model: string;          // Member model
  }[];
}
```

**Benefits:**
- **Better decisions** – Multiple perspectives on complex problems
- **Reduced bias** – Different models have different strengths
- **Unified response** – Single final answer instead of multiple conflicting outputs
- **Transparent reasoning** – Judge explains why it chose certain ideas
- **Parallel execution** – All member calls run in parallel for speed

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

## StreamOutput Type Reference

All streaming responses return a unified `StreamOutput` type, regardless of provider:

```ts
type StreamOutput = {
  text: string;              // The streamed text chunk
  done: boolean;             // True when stream is complete
  tokens?: {
    prompt?: number;         // Prompt tokens (if available)
    completion?: number;     // Completion tokens (if available)
    total?: number;          // Total tokens (if available)
  };
  raw: any;                  // Raw provider event object
  provider: string;          // 'google' | 'openai' | 'deepseek' | 'mistral' | 'anthropic'
}
```

**Example:**

```ts
const stream = await ai.generate({
  google: {
    model: 'gemini-2.5-flash',
    prompt: 'Hello!',
    stream: true,
  },
});

if (Symbol.asyncIterator in Object(stream)) {
  for await (const chunk of stream as AsyncIterable<StreamOutput>) {
    console.log(chunk.text);              // "Hello" or similar
    console.log(chunk.done);              // false, then true at end
    console.log(chunk.provider);          // "google"
    console.log(chunk.tokens?.total);     // 42 (if available)
    console.log(chunk.raw);               // Full Gemini event object
  }
}
```

**Key Benefits:**

- ✅ Same interface for all 5 providers
- ✅ Always access `chunk.text` for content
- ✅ Always access `chunk.done` to detect completion
- ✅ Token info included when provider supports it
- ✅ `chunk.raw` for provider-specific advanced use cases

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
ANTHROPIC_API_KEY=sk-ant-...
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

A practical example combining streaming with unified `StreamOutput`:

```ts
import { genChat, type StreamOutput } from 'dev-ai-sdk';

const ai = new genChat({
  google: { apiKey: process.env.GOOGLE_API_KEY! },
});

const stream = await ai.generate({
  google: {
    model: 'gemini-2.5-flash',
    prompt: 'Write a haiku about programming...',
    stream: true,
  },
});

if (Symbol.asyncIterator in Object(stream)) {
  for await (const chunk of stream as AsyncIterable<StreamOutput>) {
    // Unified interface - works the same for all 4 providers
    process.stdout.write(chunk.text);

    if (chunk.done) {
      console.log('\n');
      console.log(`Completed from ${chunk.provider}`);
      if (chunk.tokens?.total) {
        console.log(`Used ${chunk.tokens.total} tokens`);
      }
    }
  }
}
```

---

## Limitations

This is v0.0.4 — early but functional. Currently:

- Single-turn text generation (no multi-turn conversation history yet)
- Streaming returns unified `StreamOutput` objects (consistent across all providers)
- Fallback limited to non-streaming calls only
- LLM Council judge runs sequentially after all members complete
- No function calling / tool use yet
- No JSON mode / structured output yet

---

## What's Next

Future versions will include:

- Multi-turn conversation management
- Structured output helpers
- Function calling across providers
- Automatic model selection based on task complexity
- Rate limiting & caching
- React/Next.js hooks
- More providers (Azure, Cohere, Ollama, etc.)

---

## Support

- **GitHub**: https://github.com/shujanislam/dev-ai-sdk
- **Issues**: https://github.com/shujanislam/dev-ai-sdk/issues
- **Author**: Shujan Islam

---

## License

MIT — Use freely in your projects.
