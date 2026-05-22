# Express REST API Example (dev-ai-sdk)

This example shows how to use `dev-ai-sdk` inside a very basic Express REST API with OpenAI only.

## What it includes

- `POST /api/chat`: send a prompt and get an LLM response
- `GET /health`: basic health check endpoint
- Single provider setup (`openai`) with one `generate()` call

## Project structure

```text
express/
  ├─ src/
  │  └─ server.js
  ├─ .env.example
  ├─ .gitignore
  ├─ package.json
  └─ README.md
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Create environment file

```bash
cp .env.example .env
```

3. Add your OpenAI key in `.env`

```env
OPENAI_API_KEY=sk-...
```

## Run

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server URL: `http://localhost:4000`

## API usage

### Health check

```bash
curl http://localhost:4000/health
```

### Chat endpoint

```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain REST APIs in simple words"
  }'
```

### Request body

- `prompt` (string, optional). If omitted, server uses a default prompt.

### Example response

```json
{
  "data": "A REST API is a way for apps to talk over HTTP...",
  "provider": "openai",
  "model": "gpt-4o-mini"
}
```

## How dev-ai-sdk is used

This project initializes one client:

```js
import { genChat } from 'dev-ai-sdk';

const ai = new genChat({
  openai: { apiKey: process.env.OPENAI_API_KEY }
});

const result = await ai.generate({
  openai: {
    model: 'gpt-4o-mini',
    prompt: 'Hello from Express'
  }
});
```

This keeps the example intentionally small and easy to understand.
