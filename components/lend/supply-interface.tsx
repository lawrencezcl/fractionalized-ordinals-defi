"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, TrendingUp } from "lucide-react"
import { useState } from "react"

interface SupplyAsset {
  symbol: string
  name: string
  supplyApy: number
  totalSupplied: number
  yourSupply: number
  canBeCollateral: boolean
}

export function SupplyInterface() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [supplyAmount, setSupplyAmount] = useState("")

  const supplyAssets: SupplyAsset[] = [
    {
      symbol: "PUNK1234",
      name: "Bitcoin Punk #1234 Shares",
      supplyApy: 3.5,
      totalSupplied: 5000,
      yourSupply: 2500,
      canBeCollateral: true,
    },
    {
      symbol: "MONKEY567",
      name: "Ordinal Monkey #567 Shares",
      supplyApy: 4.2,
      totalSupplied: 3200,
      yourSupply: 0,
      canBeCollateral: true,
    },
    {
      symbol: "ROCK89",
      name: "BTC Rock #89 Shares",
      supplyApy: 2.8,
      totalSupplied: 8500,
      yourSupply: 0,
      canBeCollateral: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Supply Assets</CardTitle>
            <CardDescription>Supply your fractional shares to earn interest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {supplyAssets.map((asset) => (
              <div
                key={asset.symbol}
                className={`rounded-lg border p-4 cursor-pointer transition-all hover:border-primary/50 ${
                  selectedAsset === asset.symbol ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setSelectedAsset(asset.symbol)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{asset.symbol}</div>
                    <div className="text-sm text-muted-foreground truncate">{asset.name}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold text-primary flex items-center gap-1 justify-end">
                      <TrendingUp className="h-3 w-3" />
                      {asset.supplyApy}% APY
                    </div>
                    {asset.canBeCollateral && <div className="text-xs text-muted-foreground">Can be collateral</div>}
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Your balance: {asset.yourSupply.toLocaleString()}</span>
                  <span>Total supplied: {asset.totalSupplied.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {selectedAsset && (
          <Card>
            <CardHeader>
              <CardTitle>Supply {selectedAsset}</CardTitle>
              <CardDescription>Enter the amount you want to supply</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supply-amount">Amount (shares)</Label>
                <div className="flex gap-2">
                  <Input
                    id="supply-amount"
                    type="number"
                    placeholder="0"
                    value={supplyAmount}
                    onChange={(e) => setSupplyAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const asset = supplyAssets.find((a) => a.symbol === selectedAsset)
                      if (asset) setSupplyAmount(asset.yourSupply.toString())
                    }}
                  >
                    Max
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Available: {supplyAssets.find((a) => a.symbol === selectedAsset)?.yourSupply.toLocaleString()} shares
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  You'll earn {supplyAssets.find((a) => a.symbol === selectedAsset)?.supplyApy}% APY on your supplied
                  shares. Your shares can be used as collateral for borrowing.
                </AlertDescription>
              </Alert>

              <Button className="w-full" size="lg">
                Supply {selectedAsset}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supply Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold">0.25 BTC</div>
              <div className="text-sm text-muted-foreground">Total Supplied</div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average APY</span>
                <span className="font-semibold text-primary">3.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Interest Earned</span>
                <span className="font-semibold">0.0012 BTC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Used as Collateral</span>
                <span className="font-semibold">0.15 BTC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2">
              <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Earn Passive Income</div>
                <div className="text-xs text-muted-foreground">Earn interest on your idle shares</div>
              </div>
            </div>
            <div className="flex gap-2">
              <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Use as Collateral</div>
                <div className="text-xs text-muted-foreground">Borrow against your supplied assets</div>
              </div>
            </div>
            <div className="flex gap-2">
              <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Withdraw Anytime</div>
                <div className="text-xs text-muted-foreground">No lock-up periods</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
