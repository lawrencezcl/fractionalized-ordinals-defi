"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp } from "lucide-react"
import { useState } from "react"

interface PriceChartProps {
  market: string
}

export function PriceChart({ market }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState("24h")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{market}</CardTitle>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="text-3xl font-bold">0.00006 BTC</div>
              <div className="flex items-center gap-1 text-sm text-primary">
                <TrendingUp className="h-4 w-4" />
                +5.2%
              </div>
            </div>
          </div>
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="1h">1H</TabsTrigger>
              <TabsTrigger value="24h">24H</TabsTrigger>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Price chart visualization</p>
            <p className="text-xs mt-1">Powered by Ekubo DEX</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">24h High</div>
            <div className="font-semibold">0.000065</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">24h Low</div>
            <div className="font-semibold">0.000055</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">24h Volume</div>
            <div className="font-semibold">0.45 BTC</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Market Cap</div>
            <div className="font-semibold">0.6 BTC</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
