import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Link your Xverse wallet for Bitcoin Ordinals and Starknet wallet for trading.",
    },
    {
      number: "02",
      title: "Vault Your Ordinal",
      description: "Deposit your Bitcoin Ordinal into our secure multi-sig vault on Bitcoin L1.",
    },
    {
      number: "03",
      title: "Receive Fractional Shares",
      description: "Get ERC-20 tokens on Starknet representing ownership. Set your own fractionalization ratio.",
    },
    {
      number: "04",
      title: "Trade or Lend",
      description: "Trade shares on Ekubo DEX or use them as collateral on Vesu lending protocol.",
    },
  ]

  return (
    <section id="how-it-works" className="bg-muted/30 py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">How It Works</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Four simple steps to unlock liquidity from your Bitcoin Ordinals
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full border-border/50">
                <CardContent className="pt-6">
                  <div className="mb-4 text-5xl font-bold text-primary/20">{step.number}</div>
                  <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                  <ArrowRight className="h-8 w-8 text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
