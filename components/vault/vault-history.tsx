"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownToLine, ArrowUpFromLine, Clock } from "lucide-react"

interface HistoryItem {
  id: string
  type: "vault" | "redeem"
  ordinalName: string
  shares: number
  timestamp: string
  txHash: string
}

export function VaultHistory() {
  // Mock data
  const history: HistoryItem[] = [
    {
      id: "1",
      type: "vault",
      ordinalName: "Bitcoin Punk #1234",
      shares: 10000,
      timestamp: "2025-01-10 14:32:15",
      txHash: "a1b2c3d4e5f6...",
    },
  ]

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <p className="text-sm text-muted-foreground">Your vaulting and redemption history</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {history.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    item.type === "vault" ? "bg-primary/10" : "bg-accent/10"
                  }`}
                >
                  {item.type === "vault" ? (
                    <ArrowDownToLine className="h-5 w-5 text-primary" />
                  ) : (
                    <ArrowUpFromLine className="h-5 w-5 text-accent" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{item.type === "vault" ? "Vaulted" : "Redeemed"}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.shares.toLocaleString()} shares
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{item.ordinalName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Transaction</div>
                  <div className="font-mono text-xs">{item.txHash}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {history.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Transaction History</h3>
            <p className="text-center text-sm text-muted-foreground max-w-sm">
              Your vaulting and redemption transactions will appear here
            </p>
          </CardContent>
        </Card>
      )}
    </>
  )
}
