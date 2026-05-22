'use client'

import { Mail, MessageSquare, Sparkles, Zap, Brain } from 'lucide-react'

const providers = [
  {
    name: 'OpenAI',
    icon: Sparkles,
    description: 'GPT-4, GPT-4 Turbo, GPT-4o and more',
    color: 'from-green-500 to-green-600',
  },
  {
    name: 'Google Gemini',
    icon: Brain,
    description: 'Gemini 2.5, Gemini Pro, and variants',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'DeepSeek',
    icon: Zap,
    description: 'DeepSeek-Chat and models',
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Mistral',
    icon: Mail,
    description: 'Mistral-Small, Medium, Large',
    color: 'from-orange-500 to-orange-600',
  },
  {
    name: 'Anthropic Claude',
    icon: MessageSquare,
    description: 'Claude 3, 3.5 Sonnet, Opus, Haiku',
    color: 'from-red-500 to-red-600',
  },
]

export default function ProvidersShowcase() {
  return (
    <section id="providers" className="py-20 md:py-32 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Supported Providers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Switch between major AI providers with one line of code. No code changes required.
          </p>
        </div>

        {/* Providers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {providers.map((provider, index) => {
            const Icon = provider.icon
            return (
              <div
                key={index}
                className="relative group rounded-xl border border-border/40 bg-card p-6 hover:border-primary/40 transition overflow-hidden"
              >
                {/* Gradient Backdrop */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-gradient-to-br ${provider.color}`} />

                <div className="relative">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${provider.color} bg-opacity-10 mb-4`}>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Integration Note */}
        <div className="mt-16 p-6 bg-card rounded-xl border border-border/40 text-center">
          <p className="text-muted-foreground">
            Just configure the API keys you need. You don&apos;t have to set up all providers.
          </p>
        </div>
      </div>
    </section>
  )
}
