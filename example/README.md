# dev-ai-sdk Examples

This folder contains two runnable example apps that integrate `dev-ai-sdk`:

- `express/`: a basic REST API built with Express
- `next/`: a simple Next.js app with an API route and UI

Both examples use a local dependency reference to this repository:

- `"dev-ai-sdk": "file:../.."`

This makes it easy to test the SDK locally while developing.

## Prerequisites

- Node.js 18+
- npm 9+
- At least one API key for a supported provider:
  - `OPENAI_API_KEY`
  - `GOOGLE_API_KEY`
  - `DEEPSEEK_API_KEY`
  - `MISTRAL_API_KEY`
  - `ANTHROPIC_API_KEY`

## Quick Start

### 1) Express example

```bash
cd example/express
cp .env.example .env
npm install
npm run dev
```

API will run at `http://localhost:4000`.

### 2) Next.js example

```bash
cd example/next
cp .env.example .env.local
npm install
npm run dev
```

App will run at `http://localhost:3000`.

## Notes

- You only need to set the API key for the provider you are using.
- In both examples, `provider` defaults to `openai`.
- If you publish/use the SDK from npm instead of local file linking, change dependency to:

```json
"dev-ai-sdk": "^0.0.4"
```
