'use client'

import Header from '@/components/header'
import Hero from '@/components/hero'
import Features from '@/components/features'
import ProvidersShowcase from '@/components/providers-showcase'
import QuickStart from '@/components/quick-start'
import CodeExamples from '@/components/code-examples'
import StatsSection from '@/components/stats-section'
import CTA from '@/components/cta'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <StatsSection />
      <Features />
      <ProvidersShowcase />
      <QuickStart />
      <CodeExamples />
      <CTA />
      <Footer />
    </main>
  )
}
