'use client'

import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-sm font-bold">
                ⚡
              </div>
              <span>dev-ai-sdk</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Unified TypeScript SDK for AI models
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com/shujanislam/dev-ai-sdk" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition inline-flex items-center gap-2">
                  GitHub <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.npmjs.com/package/dev-ai-sdk" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition inline-flex items-center gap-2">
                  npm Package <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://github.com/shujanislam/dev-ai-sdk/issues" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition inline-flex items-center gap-2">
                  Issues <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition">Unified Interface</a></li>
              <li><a href="#features" className="hover:text-foreground transition">Streaming Support</a></li>
              <li><a href="#features" className="hover:text-foreground transition">Auto Fallback</a></li>
              <li><a href="#features" className="hover:text-foreground transition">LLM Council</a></li>
            </ul>
          </div>

          {/* Providers */}
          <div>
            <h4 className="font-semibold mb-4">Providers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>OpenAI</li>
              <li>Google Gemini</li>
              <li>DeepSeek</li>
              <li>Mistral</li>
              <li>Anthropic Claude</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 dev-ai-sdk. MIT License.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/shujanislam/dev-ai-sdk"
                target="_blank"
                rel="noreferrer"
                className="p-2 hover:bg-secondary rounded transition"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
