'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span>dev-ai-sdk</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#providers" className="text-sm text-muted-foreground hover:text-foreground transition">
              Providers
            </Link>
            <Link href="#quick-start" className="text-sm text-muted-foreground hover:text-foreground transition">
              Quick Start
            </Link>
            <Link href="#examples" className="text-sm text-muted-foreground hover:text-foreground transition">
              Examples
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/shujanislam/dev-ai-sdk"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/dev-ai-sdk"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
            >
              npm install
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-3 border-t border-border/40 pt-4">
            <Link
              href="#features"
              className="block text-sm text-muted-foreground hover:text-foreground transition"
            >
              Features
            </Link>
            <Link
              href="#providers"
              className="block text-sm text-muted-foreground hover:text-foreground transition"
            >
              Providers
            </Link>
            <Link
              href="#quick-start"
              className="block text-sm text-muted-foreground hover:text-foreground transition"
            >
              Quick Start
            </Link>
            <Link
              href="#examples"
              className="block text-sm text-muted-foreground hover:text-foreground transition"
            >
              Examples
            </Link>
            <div className="flex gap-3 pt-3">
              <a
                href="https://github.com/shujanislam/dev-ai-sdk"
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center text-sm text-muted-foreground hover:text-foreground transition py-2"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/dev-ai-sdk"
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition text-center"
              >
                npm install
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
