import express from 'express';
import dotenv from 'dotenv';
import { genChat } from 'dev-ai-sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const ai = new genChat({
  openai: { apiKey: process.env.OPENAI_API_KEY }
});

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'dev-ai-sdk-express-example' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const prompt = req.body?.prompt || 'Say hello from Express and dev-ai-sdk.';
    const response = await ai.generate({
      openai: {
        model: 'gpt-4o-mini',
        prompt
      }
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Express example server listening on http://localhost:${port}`);
});
