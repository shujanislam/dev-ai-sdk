'use client'

import { Zap, RefreshCw, Layers, Code2, Shield, GitBranch } from 'lucide-react'

const features = [
  {
    icon: GitBranch,
    title: 'Single Interface',
    description: 'Write once, switch providers. Same code works across OpenAI, Google Gemini, DeepSeek, Mistral, and Anthropic Claude.',
  },
  {
    icon: Shield,
    title: 'Type-Safe',
    description: 'Full TypeScript support with proper types for all providers and operations. Catch errors at compile time.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Only 15KB gzipped. Minimal dependencies—just dotenv for environment variables. Zero bloat.',
  },
  {
    icon: Layers,
    title: 'Streaming Built-in',
    description: 'Real-time responses without custom parsing. Unified StreamOutput format across all providers.',
  },
  {
    icon: RefreshCw,
    title: 'Automatic Fallback',
    description: 'Provider fails? Automatically retry with others. Reliable production behavior by default.',
  },
  {
    icon: Code2,
    title: 'LLM Council',
    description: 'Run same prompt across multiple models and have a judge synthesize the best answer for complex decisions.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Framework Agnostic AI Toolkit</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The open-source SDK designed to help developers build AI-powered applications with React, Next.js, Node.js, and more.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="relative group rounded-xl border border-border/40 bg-card p-8 hover:border-primary/40 transition"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition rounded-xl bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="relative">
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
