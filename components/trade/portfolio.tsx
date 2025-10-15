"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function Portfolio() {
  const holdings = [
    {
      symbol: "PUNK1234",
      shares: 2500,
      avgPrice: 0.000055,
      currentPrice: 0.00006,
      value: 0.15,
      pnl: 9.09,
    },
  ]

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Portfolio</CardTitle>
        <div className="mt-2">
          <div className="text-2xl font-bold">{totalValue.toFixed(4)} BTC</div>
          <div className="text-sm text-muted-foreground">Total Value</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {holdings.map((holding, i) => (
          <div key={i} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{holding.symbol}</div>
              <div className={`text-sm ${holding.pnl >= 0 ? "text-primary" : "text-destructive"}`}>
                {holding.pnl >= 0 ? "+" : ""}
                {holding.pnl}%
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shares</span>
                <span>{holding.shares.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Price</span>
                <span className="font-mono">{holding.avgPrice.toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current</span>
                <span className="font-mono">{holding.currentPrice.toFixed(8)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">Value</span>
                <span>{holding.value.toFixed(4)} BTC</span>
              </div>
            </div>
          </div>
        ))}

        {holdings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No holdings yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
