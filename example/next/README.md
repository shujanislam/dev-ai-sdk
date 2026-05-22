# Next.js Example (dev-ai-sdk)

This example shows a simple Next.js app using `dev-ai-sdk` from a server-side API route with OpenAI only.

## What it includes

- A client UI in `app/page.js` for entering a prompt
- A server route in `app/api/chat/route.js` that calls `dev-ai-sdk`
- Minimal styling and responsive layout

## Project structure

```text
next/
  ├─ app/
  │  ├─ api/chat/route.js
  │  ├─ globals.css
  │  ├─ layout.js
  │  └─ page.js
  ├─ .env.example
  ├─ .gitignore
  ├─ jsconfig.json
  ├─ next.config.mjs
  ├─ package.json
  └─ README.md
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Create local environment file

```bash
cp .env.example .env.local
```

3. Add your OpenAI key in `.env.local`

```env
OPENAI_API_KEY=sk-...
```

## Run

Development mode:

```bash
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
npm start
```

## API usage

The app uses `POST /api/chat` under the hood.

Request example:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Give me three tips to write cleaner code"
  }'
```

Response example:

```json
{
  "data": "1) Use clear names...",
  "provider": "openai",
  "model": "gpt-4o-mini"
}
```

## How dev-ai-sdk is used

Server route (`app/api/chat/route.js`) initializes the SDK and calls OpenAI directly:

```js
import { genChat } from 'dev-ai-sdk';

const ai = new genChat({
  openai: { apiKey: process.env.OPENAI_API_KEY }
});

const result = await ai.generate({
  openai: {
    model: 'gpt-4o-mini',
    prompt: 'Hello from Next.js'
  }
});
```

The UI calls this route and renders the returned `data`, `provider`, and `model`.
