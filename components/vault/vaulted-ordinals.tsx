"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, TrendingUp } from "lucide-react"

interface VaultedOrdinal {
  id: string
  name: string
  image: string
  totalShares: number
  yourShares: number
  sharePrice: number
  priceChange24h: number
  vaultedDate: string
}

export function VaultedOrdinals() {
  // Mock data
  const vaultedOrdinals: VaultedOrdinal[] = [
    {
      id: "1",
      name: "Bitcoin Punk #1234",
      image: "/bitcoin-punk-nft.jpg",
      totalShares: 10000,
      yourShares: 10000,
      sharePrice: 0.00006,
      priceChange24h: 5.2,
      vaultedDate: "2025-01-10",
    },
  ]

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Vaulted Ordinals</h2>
        <p className="text-sm text-muted-foreground">Ordinals you've vaulted and their fractional shares</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {vaultedOrdinals.map((ordinal) => {
          const ownershipPercent = (ordinal.yourShares / ordinal.totalShares) * 100
          const totalValue = ordinal.yourShares * ordinal.sharePrice

          return (
            <Card key={ordinal.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={ordinal.image || "/placeholder.svg"}
                      alt={ordinal.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">{ordinal.name}</CardTitle>
                        <CardDescription>Vaulted on {ordinal.vaultedDate}</CardDescription>
                      </div>
                      <Badge variant={ordinal.priceChange24h >= 0 ? "default" : "destructive"} className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {ordinal.priceChange24h >= 0 ? "+" : ""}
                        {ordinal.priceChange24h}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Your Shares</div>
                    <div className="text-2xl font-bold">{ordinal.yourShares.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">of {ordinal.totalShares.toLocaleString()} total</div>
                    <Progress value={ownershipPercent} className="mt-2" />
                    <div className="text-xs text-muted-foreground mt-1">{ownershipPercent.toFixed(1)}% ownership</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Share Price</div>
                    <div className="text-2xl font-bold">{ordinal.sharePrice.toFixed(8)} BTC</div>
                    <div className="text-xs text-muted-foreground">per share</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Value</div>
                    <div className="text-2xl font-bold text-primary">{totalValue.toFixed(4)} BTC</div>
                    <div className="text-xs text-muted-foreground">current market value</div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <ExternalLink className="h-4 w-4" />
                    View on Explorer
                  </Button>
                  <Button variant="outline">Manage Shares</Button>
                  {ownershipPercent === 100 && <Button>Redeem Ordinal</Button>}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {vaultedOrdinals.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Vaulted Ordinals</h3>
            <p className="text-center text-sm text-muted-foreground max-w-sm">
              You haven't vaulted any Ordinals yet. Go to "My Ordinals" to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  )
}
