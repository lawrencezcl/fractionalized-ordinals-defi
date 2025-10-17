"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, TrendingUp, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { platformService, PortfolioOverview } from "@/lib/services/platform-service"

interface SupplyAsset {
  symbol: string
  name: string
  address: string
  supplyApy: number
  totalSupplied: number
  yourSupply: number
  canBeCollateral: boolean
}

export function SupplyInterface() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [supplyAmount, setSupplyAmount] = useState("")
  const [isSupplying, setIsSupplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [supplyAssets, setSupplyAssets] = useState<SupplyAsset[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAssetsAndPortfolio()
  }, [])

  const loadAssetsAndPortfolio = async () => {
    setIsLoading(true)
    try {
      // Load user's fractional shares from portfolio
      const userPortfolio = await platformService.getPortfolioOverview('0xmockuseraddress')
      setPortfolio(userPortfolio)

      // Transform fractional shares into supplyable assets
      const assets: SupplyAsset[] = userPortfolio.fractionalShares.map((share, index) => ({
        symbol: share.symbol,
        name: share.name,
        address: share.contractAddress,
        supplyApy: 3.5 + (index * 0.7), // Mock APY calculation
        totalSupplied: 10000 + (index * 2000), // Mock total supplied
        yourSupply: parseInt(share.balance),
        canBeCollateral: true
      }))

      setSupplyAssets(assets)
    } catch (error) {
      console.error('Error loading assets:', error)
      setError('Failed to load your assets. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSupply = async () => {
    if (!selectedAsset || !supplyAmount) {
      setError('Please select an asset and enter a valid amount')
      return
    }

    const asset = supplyAssets.find(a => a.symbol === selectedAsset)
    if (!asset) {
      setError('Selected asset not found')
      return
    }

    const amount = parseInt(supplyAmount)
    if (amount > asset.yourSupply) {
      setError('Insufficient balance')
      return
    }

    setIsSupplying(true)
    setError(null)
    setSuccess(null)

    try {
      const txHash = await platformService.supplyToLending(asset.address, amount)
      setSuccess(`Successfully supplied ${amount} ${asset.symbol}! Transaction: ${txHash.slice(0, 10)}...`)

      // Reload assets and portfolio
      await loadAssetsAndPortfolio()

      // Reset form
      setSupplyAmount('')
      setSelectedAsset(null)
    } catch (error) {
      console.error('Error supplying asset:', error)
      setError(error instanceof Error ? error.message : 'Failed to supply asset')
    } finally {
      setIsSupplying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your assets...</span>
      </div>
    )
  }

  if (supplyAssets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 text-center">
            <h3 className="mb-2 text-lg font-semibold">No Assets Available</h3>
            <p className="text-sm text-muted-foreground">
              You don't have any fractional shares that can be supplied to the lending protocol.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {error && (
          <Alert className="border-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

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
                    placeholder="Amount"
                    value={supplyAmount}
                    onChange={(e) => setSupplyAmount(e.target.value)}
                    className="flex-1"
                    disabled={isSupplying}
                    data-testid="supply-amount-input"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const asset = supplyAssets.find((a) => a.symbol === selectedAsset)
                      if (asset) setSupplyAmount(asset.yourSupply.toString())
                    }}
                    disabled={isSupplying}
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

              <Button
                className="w-full"
                size="lg"
                onClick={handleSupply}
                disabled={isSupplying || !supplyAmount || parseInt(supplyAmount) <= 0}
                data-testid="supply-button"
              >
                {isSupplying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Supplying...
                  </>
                ) : (
                  `Supply ${selectedAsset}`
                )}
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
              <div className="text-2xl font-bold">
                {portfolio ? `${parseFloat(portfolio.totalValue).toFixed(4)} BTC` : '0.0000 BTC'}
              </div>
              <div className="text-sm text-muted-foreground">Total Supplied</div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average APY</span>
                <span className="font-semibold text-primary">
                  {supplyAssets.length > 0
                    ? (supplyAssets.reduce((sum, asset) => sum + asset.supplyApy, 0) / supplyAssets.length).toFixed(1)
                    : '0.0'
                  }%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Interest Earned</span>
                <span className="font-semibold">
                  {portfolio ? `${(parseFloat(portfolio.totalValue) * 0.05).toFixed(6)} BTC` : '0.000000 BTC'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Used as Collateral</span>
                <span className="font-semibold">
                  {portfolio ? `${(parseFloat(portfolio.lendingPositions.totalCollateralValue) * 0.001).toFixed(6)} BTC` : '0.000000 BTC'}
                </span>
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
