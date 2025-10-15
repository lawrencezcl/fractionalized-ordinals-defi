"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"

interface Market {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  volume24h: number
  image: string
}

interface MarketListProps {
  selectedMarket: string
  onSelectMarket: (market: string) => void
}

export function MarketList({ selectedMarket, onSelectMarket }: MarketListProps) {
  const [search, setSearch] = useState("")

  const markets: Market[] = [
    {
      id: "PUNK1234",
      name: "Bitcoin Punk #1234",
      symbol: "PUNK1234",
      price: 0.00006,
      change24h: 5.2,
      volume24h: 0.45,
      image: "/bitcoin-punk-nft.jpg",
    },
    {
      id: "MONKEY567",
      name: "Ordinal Monkey #567",
      symbol: "MONKEY567",
      price: 0.00003,
      change24h: -2.1,
      volume24h: 0.28,
      image: "/abstract-monkey-nft.png",
    },
    {
      id: "ROCK89",
      name: "BTC Rock #89",
      symbol: "ROCK89",
      price: 0.00012,
      change24h: 8.7,
      volume24h: 0.92,
      image: "/rock-nft.jpg",
    },
  ]

  const filteredMarkets = markets.filter(
    (market) =>
      market.name.toLowerCase().includes(search.toLowerCase()) ||
      market.symbol.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Markets</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {filteredMarkets.map((market) => (
            <button
              key={market.id}
              onClick={() => onSelectMarket(market.id)}
              className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${
                selectedMarket === market.id ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={market.image || "/placeholder.svg"}
                    alt={market.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{market.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">{market.name}</div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="font-mono text-sm">{market.price.toFixed(8)}</div>
                <Badge variant={market.change24h >= 0 ? "default" : "destructive"} className="gap-1 text-xs">
                  {market.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {market.change24h >= 0 ? "+" : ""}
                  {market.change24h}%
                </Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Vol: {market.volume24h} BTC</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
