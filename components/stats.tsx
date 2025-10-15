import { TrendingUp, Shield, Zap, Users } from "lucide-react"

export function Stats() {
  const stats = [
    {
      icon: TrendingUp,
      value: "24/7",
      label: "Trading Available",
      description: "Trade fractional shares anytime",
    },
    {
      icon: Shield,
      value: "100%",
      label: "Secure Vaulting",
      description: "Multi-sig Bitcoin custody",
    },
    {
      icon: Zap,
      value: "<1s",
      label: "Transaction Speed",
      description: "Lightning-fast on Starknet",
    },
    {
      icon: Users,
      value: "0%",
      label: "Platform Fees",
      description: "Launch period promotion",
    },
  ]

  return (
    <section className="border-y border-border bg-muted/30 py-16">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="mt-1 font-medium">{stat.label}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
