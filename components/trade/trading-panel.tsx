"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

interface TradingPanelProps {
  market: string
}

export function TradingPanel({ market }: TradingPanelProps) {
  const [buyAmount, setBuyAmount] = useState("")
  const [buyPrice, setBuyPrice] = useState("0.00006")
  const [sellAmount, setSellAmount] = useState("")
  const [sellPrice, setSellPrice] = useState("0.00006")
  const [buyPercentage, setBuyPercentage] = useState([0])
  const [sellPercentage, setSellPercentage] = useState([0])

  const balance = 0.1 // BTC
  const sharesOwned = 2500

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="buy-price">Price (BTC per share)</Label>
              <Input
                id="buy-price"
                type="number"
                step="0.00000001"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buy-amount">Amount (shares)</Label>
              <Input
                id="buy-amount"
                type="number"
                placeholder="0"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
              />
              <Slider
                value={buyPercentage}
                onValueChange={(value) => {
                  setBuyPercentage(value)
                  const maxShares = balance / Number.parseFloat(buyPrice)
                  setBuyAmount(((maxShares * value[0]) / 100).toFixed(0))
                }}
                max={100}
                step={25}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-semibold">{balance} BTC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-semibold">
                  {(Number.parseFloat(buyAmount || "0") * Number.parseFloat(buyPrice)).toFixed(8)} BTC
                </span>
              </div>
            </div>

            <Button className="w-full" size="lg">
              Buy {market}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="sell-price">Price (BTC per share)</Label>
              <Input
                id="sell-price"
                type="number"
                step="0.00000001"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell-amount">Amount (shares)</Label>
              <Input
                id="sell-amount"
                type="number"
                placeholder="0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />
              <Slider
                value={sellPercentage}
                onValueChange={(value) => {
                  setSellPercentage(value)
                  setSellAmount(((sharesOwned * value[0]) / 100).toFixed(0))
                }}
                max={100}
                step={25}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shares Owned</span>
                <span className="font-semibold">{sharesOwned.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Receive</span>
                <span className="font-semibold">
                  {(Number.parseFloat(sellAmount || "0") * Number.parseFloat(sellPrice)).toFixed(8)} BTC
                </span>
              </div>
            </div>

            <Button className="w-full" size="lg" variant="destructive">
              Sell {market}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
