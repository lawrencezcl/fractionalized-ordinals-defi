"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TradeHistoryProps {
  market: string
}

interface Trade {
  id: string
  type: "buy" | "sell"
  price: number
  amount: number
  time: string
}

export function TradeHistory({ market }: TradeHistoryProps) {
  const trades: Trade[] = [
    { id: "1", type: "buy", price: 0.00006, amount: 150, time: "14:32:15" },
    { id: "2", type: "sell", price: 0.000059, amount: 200, time: "14:31:42" },
    { id: "3", type: "buy", price: 0.00006, amount: 180, time: "14:30:28" },
    { id: "4", type: "buy", price: 0.000061, amount: 220, time: "14:29:55" },
    { id: "5", type: "sell", price: 0.000058, amount: 160, time: "14:28:33" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 py-2 grid grid-cols-4 text-xs text-muted-foreground">
          <div>Time</div>
          <div className="text-right">Price</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Type</div>
        </div>
        <div className="divide-y divide-border">
          {trades.map((trade) => (
            <div key={trade.id} className="px-6 py-2 grid grid-cols-4 text-sm hover:bg-muted/50">
              <div className="text-muted-foreground">{trade.time}</div>
              <div className={`text-right font-mono ${trade.type === "buy" ? "text-primary" : "text-destructive"}`}>
                {trade.price.toFixed(8)}
              </div>
              <div className="text-right">{trade.amount.toLocaleString()}</div>
              <div className="text-right">
                <Badge variant={trade.type === "buy" ? "default" : "destructive"} className="text-xs">
                  {trade.type.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
