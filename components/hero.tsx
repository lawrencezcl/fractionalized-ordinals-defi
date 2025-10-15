import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="container relative">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Powered by Bitcoin L1 & Starknet
          </div>

          {/* Main heading */}
          <h1 className="max-w-4xl text-balance text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Unlock the Value of{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bitcoin Ordinals
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Fractionalize expensive Bitcoin Ordinals into tradeable shares. Vault your NFTs on Bitcoin L1, trade on
            Starknet, and unlock DeFi opportunities.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 text-base">
              Start Vaulting
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              View Documentation
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
            <div>
              <div className="text-3xl font-bold text-primary">$2.5M+</div>
              <div className="mt-1 text-sm text-muted-foreground">Total Value Locked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">150+</div>
              <div className="mt-1 text-sm text-muted-foreground">Ordinals Vaulted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">1,200+</div>
              <div className="mt-1 text-sm text-muted-foreground">Active Traders</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
