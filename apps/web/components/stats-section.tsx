'use client'

export default function StatsSection() {
  return (
    <section className="border-y border-border/40 bg-secondary/20 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5</div>
            <p className="text-sm text-muted-foreground">Major AI Providers</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15KB</div>
            <p className="text-sm text-muted-foreground">Gzipped Bundle Size</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">0</div>
            <p className="text-sm text-muted-foreground">Code Changes to Switch</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">v0.0.4</div>
            <p className="text-sm text-muted-foreground">Latest Version</p>
          </div>
        </div>
      </div>
    </section>
  )
}
