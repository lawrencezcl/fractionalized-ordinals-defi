"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { platformService } from "@/lib/services/platform-service"

interface TradingPanelProps {
  market: string
  tokenAddress?: string
}

export function TradingPanel({ market, tokenAddress }: TradingPanelProps) {
  const [buyAmount, setBuyAmount] = useState("")
  const [buyPrice, setBuyPrice] = useState("0.00006")
  const [sellAmount, setSellAmount] = useState("")
  const [sellPrice, setSellPrice] = useState("0.00006")
  const [buyPercentage, setBuyPercentage] = useState([0])
  const [sellPercentage, setSellPercentage] = useState([0])
  const [isExecuting, setIsExecuting] = useState(false)
  const [balance, setBalance] = useState(0.1)
  const [sharesOwned, setSharesOwned] = useState(2500)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Load user's actual balance and share ownership
    loadUserData()
  }, [tokenAddress])

  const loadUserData = async () => {
    try {
      // This would fetch actual user data
      // For now, keep mock data
      setBalance(0.1)
      setSharesOwned(2500)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleBuy = async () => {
    if (!buyAmount || !buyPrice) {
      setError('Please enter valid amount and price')
      return
    }

    const totalCost = parseFloat(buyAmount) * parseFloat(buyPrice)
    if (totalCost > balance) {
      setError('Insufficient balance')
      return
    }

    setIsExecuting(true)
    setError(null)
    setSuccess(null)

    try {
      // Execute swap through Ekubo DEX
      const txHash = await platformService.swapTokens(
        '0xbtc_address', // Would be actual WBTC address
        tokenAddress || '0xtoken_address',
        totalCost * 100000000, // Convert to satoshis
        parseFloat(buyAmount) * 0.95 * 100000000 // 5% slippage tolerance
      )

      setSuccess(`Buy order executed! Transaction: ${txHash.slice(0, 10)}...`)

      // Update user data
      await loadUserData()

      // Reset form
      setBuyAmount('')
      setBuyPercentage([0])
    } catch (error) {
      console.error('Error executing buy order:', error)
      setError(error instanceof Error ? error.message : 'Failed to execute buy order')
    } finally {
      setIsExecuting(false)
    }
  }

  const handleSell = async () => {
    if (!sellAmount || !sellPrice) {
      setError('Please enter valid amount and price')
      return
    }

    const sharesToSell = parseInt(sellAmount)
    if (sharesToSell > sharesOwned) {
      setError('Insufficient shares')
      return
    }

    setIsExecuting(true)
    setError(null)
    setSuccess(null)

    try {
      // Execute swap through Ekubo DEX
      const totalReceive = sharesToSell * parseFloat(sellPrice)
      const txHash = await platformService.swapTokens(
        tokenAddress || '0xtoken_address',
        '0xbtc_address', // Would be actual WBTC address
        sharesToSell,
        totalReceive * 0.95 * 100000000 // 5% slippage tolerance
      )

      setSuccess(`Sell order executed! Transaction: ${txHash.slice(0, 10)}...`)

      // Update user data
      await loadUserData()

      // Reset form
      setSellAmount('')
      setSellPercentage([0])
    } catch (error) {
      console.error('Error executing sell order:', error)
      setError(error instanceof Error ? error.message : 'Failed to execute sell order')
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trade {market}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

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
                disabled={isExecuting}
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
                disabled={isExecuting}
              />
              <Slider
                value={buyPercentage}
                onValueChange={(value) => {
                  setBuyPercentage(value)
                  const maxShares = balance / Number.parseFloat(buyPrice || "0")
                  setBuyAmount(((maxShares * value[0]) / 100).toFixed(0))
                }}
                max={100}
                step={25}
                className="mt-2"
                disabled={isExecuting}
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
                <span className="font-semibold">{balance.toFixed(8)} BTC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-semibold">
                  {(parseFloat(buyAmount || "0") * parseFloat(buyPrice)).toFixed(8)} BTC
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleBuy}
              disabled={isExecuting || !buyAmount || parseFloat(buyAmount) <= 0}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing...
                </>
              ) : (
                `Buy ${market}`
              )}
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
                disabled={isExecuting}
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
                disabled={isExecuting}
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
                disabled={isExecuting}
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
                  {(parseFloat(sellAmount || "0") * parseFloat(sellPrice)).toFixed(8)} BTC
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              variant="destructive"
              onClick={handleSell}
              disabled={isExecuting || !sellAmount || parseInt(sellAmount) <= 0}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing...
                </>
              ) : (
                `Sell ${market}`
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
