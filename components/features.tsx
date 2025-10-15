import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vault, ArrowLeftRight, Coins, TrendingUp, Lock, Wallet } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Vault,
      title: "Secure Vaulting",
      description:
        "Deposit your Bitcoin Ordinals into a secure multi-signature vault on Bitcoin L1 using Xverse wallet integration.",
    },
    {
      icon: Coins,
      title: "Fractional Shares",
      description:
        "Receive ERC-20 tokens on Starknet representing fractional ownership of vaulted Ordinals. Trade as little as 0.01%.",
    },
    {
      icon: ArrowLeftRight,
      title: "Instant Trading",
      description: "Buy and sell fractional shares on Ekubo DEX with deep liquidity and minimal slippage.",
    },
    {
      icon: TrendingUp,
      title: "DeFi Lending",
      description: "Use your fractional shares as collateral on Vesu protocol to borrow stablecoins or other assets.",
    },
    {
      icon: Lock,
      title: "Redemption Rights",
      description:
        "Collect 100% of shares to redeem the original Ordinal from the vault. Full ownership, full control.",
    },
    {
      icon: Wallet,
      title: "Cross-Chain Bridge",
      description: "Seamless bridging between Bitcoin L1 and Starknet powered by Starknet Asset Runes protocol.",
    },
  ]

  return (
    <section id="features" className="py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything You Need for Ordinals DeFi
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A complete platform for fractionalizing, trading, and leveraging your Bitcoin Ordinals
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
