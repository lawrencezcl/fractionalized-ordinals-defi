"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { useState } from "react"

interface Asset {
  symbol: string
  name: string
  available: number
  apy: number
  ltv: number
}

export function BorrowInterface() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [borrowAmount, setBorrowAmount] = useState("")

  const borrowableAssets: Asset[] = [
    { symbol: "USDC", name: "USD Coin", available: 50000, apy: 5.2, ltv: 75 },
    { symbol: "USDT", name: "Tether USD", available: 45000, apy: 4.8, ltv: 75 },
    { symbol: "DAI", name: "Dai Stablecoin", available: 30000, apy: 5.5, ltv: 75 },
    { symbol: "WBTC", name: "Wrapped Bitcoin", available: 2.5, apy: 3.2, ltv: 70 },
  ]

  const collateralValue = 0.15 // BTC
  const maxBorrowPower = collateralValue * 0.75 // 75% LTV
  const currentBorrowed = 0.08
  const availableToBorrow = maxBorrowPower - currentBorrowed

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Borrow Assets</CardTitle>
            <CardDescription>Select an asset to borrow against your collateral</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {borrowableAssets.map((asset) => (
              <div
                key={asset.symbol}
                className={`rounded-lg border p-4 cursor-pointer transition-all hover:border-primary/50 ${
                  selectedAsset === asset.symbol ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setSelectedAsset(asset.symbol)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{asset.symbol}</div>
                    <div className="text-sm text-muted-foreground">{asset.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary">{asset.apy}% APY</div>
                    <div className="text-xs text-muted-foreground">LTV: {asset.ltv}%</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Available: {asset.available.toLocaleString()} {asset.symbol}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {selectedAsset && (
          <Card>
            <CardHeader>
              <CardTitle>Borrow {selectedAsset}</CardTitle>
              <CardDescription>Enter the amount you want to borrow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="borrow-amount">Amount</Label>
                <div className="flex gap-2">
                  <Input
                    id="borrow-amount"
                    type="number"
                    placeholder="0.00"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => setBorrowAmount(availableToBorrow.toFixed(4))}>
                    Max
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Available to borrow: {availableToBorrow.toFixed(4)} BTC</p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  You'll pay {borrowableAssets.find((a) => a.symbol === selectedAsset)?.apy}% APY on this loan. Interest
                  accrues continuously.
                </AlertDescription>
              </Alert>

              <Button className="w-full" size="lg">
                Borrow {selectedAsset}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Borrow Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Used</span>
                <span className="font-semibold">
                  {currentBorrowed.toFixed(4)} / {maxBorrowPower.toFixed(4)} BTC
                </span>
              </div>
              <Progress value={(currentBorrowed / maxBorrowPower) * 100} />
              <p className="text-xs text-muted-foreground mt-1">
                {((currentBorrowed / maxBorrowPower) * 100).toFixed(1)}% utilized
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Collateral Value</span>
                <span className="font-semibold">{collateralValue.toFixed(4)} BTC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Max Borrow (75% LTV)</span>
                <span className="font-semibold">{maxBorrowPower.toFixed(4)} BTC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Currently Borrowed</span>
                <span className="font-semibold">{currentBorrowed.toFixed(4)} BTC</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground">Available to Borrow</span>
                <span className="font-semibold text-primary">{availableToBorrow.toFixed(4)} BTC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Collateral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">PUNK1234</span>
                <span className="text-sm text-muted-foreground">2,500 shares</span>
              </div>
              <div className="text-sm text-muted-foreground">Value: {collateralValue.toFixed(4)} BTC</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
