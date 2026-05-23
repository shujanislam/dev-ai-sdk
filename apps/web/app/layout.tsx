import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'dev-ai-sdk - Unified TypeScript SDK for AI Models',
  description: 'A unified TypeScript SDK for using multiple AI providers with one simple interface. Switch between OpenAI, Google Gemini, DeepSeek, Mistral, and Anthropic Claude with zero code changes.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo-dev-ai-sdk.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo-dev-ai-sdk.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo-dev-ai-sdk.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo-dev-ai-sdk.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background scroll-smooth">
      <body className="font-sans antialiased text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
