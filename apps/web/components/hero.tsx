'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Announcement Badge */}
        <div className="mb-8 flex justify-center">
          <a
            href="https://github.com/shujanislam/dev-ai-sdk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Now open source on GitHub
          </a>
        </div>

        {/* Main Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Universal AI Layer for TypeScript
          </h1>
          <p className="text-balance text-xl text-muted-foreground mb-8">
            Stop juggling different AI API docs. Write once, switch providers seamlessly. Use OpenAI, Google Gemini, DeepSeek, Mistral, and Anthropic Claude with one unified interface.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#quick-start"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Get Started
              <ArrowRight size={18} />
            </a>
            <a
              href="https://github.com/shujanislam/dev-ai-sdk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:bg-secondary transition rounded-lg font-medium"
            >
              View on GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">AI Providers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">15KB</div>
              <div className="text-sm text-muted-foreground">Gzipped Size</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Type Safe</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
