'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const examples = [
  {
    title: 'Streaming Responses',
    description: 'Get real-time responses without custom parsing',
    code: `const stream = await ai.generate({
  google: {
    model: 'gemini-2.5-flash',
    prompt: 'Write a haiku...',
    stream: true,
  },
});

for await (const chunk of stream) {
  console.log(chunk.text);
  if (chunk.done) {
    console.log(\`Completed from \${chunk.provider}\`);
  }
}`,
  },
  {
    title: 'Automatic Fallback',
    description: 'Reliability by default with provider fallback',
    code: `const ai = new genChat({
  openai: { apiKey: process.env.OPENAI_API_KEY },
  google: { apiKey: process.env.GOOGLE_API_KEY },
  fallback: true,
});

const result = await ai.generate({
  openai: {
    model: 'gpt-4o-mini',
    prompt: 'What is 2+2?',
  },
});

// Uses Google if OpenAI fails
console.log(result.provider);`,
  },
  {
    title: 'LLM Council',
    description: 'Get answers from multiple models',
    code: `const decision = await ai.councilGenerate({
  members: [
    { google: { model: 'gemini-2.5-flash-lite' } },
    { mistral: { model: 'mistral-small-latest' } },
  ],
  judge: { openai: { model: 'gpt-4o-mini' } },
  prompt: 'Top 3 languages for 2025?',
});

console.log(decision.finalAnswer);
console.log(decision.memberResponses);
console.log(decision.reasoning);`,
  },
]

export default function CodeExamples() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (code: string, title: string) => {
    navigator.clipboard.writeText(code)
    setCopied(title)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section id="examples" className="py-20 md:py-32 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Common Patterns</h2>
          <p className="text-xl text-muted-foreground">
            Explore powerful patterns you can implement today
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl border border-border/40 bg-card overflow-hidden hover:border-primary/40 transition"
            >
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold mb-2">{example.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{example.description}</p>
              </div>

              <div className="border-t border-border/40">
                <div className="relative">
                  <pre className="p-4 bg-black/20 overflow-x-auto">
                    <code className="text-xs font-mono text-foreground">
                      {example.code}
                    </code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(example.code, example.title)}
                    className="absolute top-3 right-3 p-2 hover:bg-secondary rounded transition"
                  >
                    {copied === example.title ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Docs CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Want to learn more?</p>
          <a
            href="https://github.com/shujanislam/dev-ai-sdk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
          >
            View Full Documentation
          </a>
        </div>
      </div>
    </section>
  )
}
