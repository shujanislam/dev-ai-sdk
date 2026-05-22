import { NextResponse } from 'next/server';
import { genChat } from 'dev-ai-sdk';

export async function POST(request) {
  try {
    const body = await request.json();
    const prompt = body?.prompt || 'Say hello from Next.js and dev-ai-sdk.';
    const ai = new genChat({
      openai: { apiKey: process.env.OPENAI_API_KEY }
    });
    const result = await ai.generate({
      openai: {
        model: 'gpt-4o-mini',
        prompt
      }
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
