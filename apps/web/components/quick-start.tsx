'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

const codeExample = `import { genChat } from 'dev-ai-sdk';

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
console.log(result.model); // "gpt-4o-mini"`

export default function QuickStart() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="quick-start" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Quick Start</h2>
          <p className="text-xl text-muted-foreground">
            Get up and running in 5 minutes. Just one import and you&apos;re ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Installation Step */}
          <div className="space-y-8">
            <div>
              <div className="text-sm font-mono font-semibold text-primary mb-2">Installation</div>
              <div className="bg-card border border-border/40 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-foreground font-mono text-sm">$ npm install dev-ai-sdk</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('npm install dev-ai-sdk')
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="p-2 hover:bg-secondary rounded transition"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-mono font-semibold text-primary mb-2">Environment Setup</div>
              <div className="bg-card border border-border/40 rounded-lg p-4 font-mono text-sm space-y-1">
                <div><span className="text-muted-foreground"># .env</span></div>
                <div><span className="text-blue-400">OPENAI_API_KEY</span><span>=</span><span className="text-green-400">sk-...</span></div>
                <div><span className="text-blue-400">GOOGLE_API_KEY</span><span>=</span><span className="text-green-400">AIza...</span></div>
                <div><span className="text-blue-400">ANTHROPIC_API_KEY</span><span>=</span><span className="text-green-400">sk-ant-...</span></div>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div>
            <div className="text-sm font-mono font-semibold text-primary mb-2">5-Minute Example</div>
            <div className="relative">
              <pre className="bg-card border border-border/40 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
                  {codeExample}
                </code>
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 hover:bg-secondary rounded transition"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-16 p-8 bg-secondary/20 rounded-xl border border-border/40">
          <h3 className="text-xl font-bold mb-4">What&apos;s Next?</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">→</span>
              <span>Try streaming responses for real-time data</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">→</span>
              <span>Enable automatic fallback for reliability</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">→</span>
              <span>Use LLM Council for better decisions</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
