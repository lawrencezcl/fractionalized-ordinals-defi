"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Loader2 } from "lucide-react"

interface VaultDialogProps {
  ordinal: {
    id: string
    name: string
    floorPrice: number
    image: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VaultDialog({ ordinal, open, onOpenChange }: VaultDialogProps) {
  const [totalShares, setTotalShares] = useState(10000)
  const [pricePerShare, setPricePerShare] = useState(0.00005)
  const [isVaulting, setIsVaulting] = useState(false)

  const handleVault = async () => {
    setIsVaulting(true)
    // Simulate vaulting transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsVaulting(false)
    onOpenChange(false)
  }

  const marketCap = totalShares * pricePerShare

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vault & Fractionalize Ordinal</DialogTitle>
          <DialogDescription>Set your fractionalization parameters for {ordinal.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
              <img
                src={ordinal.image || "/placeholder.svg"}
                alt={ordinal.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Ordinal Name</div>
                <div className="font-semibold">{ordinal.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Floor Price</div>
                <div className="font-semibold">{ordinal.floorPrice} BTC</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Estimated Market Cap</div>
                <div className="font-semibold text-primary">{marketCap.toFixed(4)} BTC</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="total-shares">Total Shares to Mint</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="total-shares"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={[totalShares]}
                  onValueChange={(value) => setTotalShares(value[0])}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={totalShares}
                  onChange={(e) => setTotalShares(Number(e.target.value))}
                  className="w-32"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Higher share count = more liquidity and smaller minimum investment
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price-per-share">Initial Price Per Share (BTC)</Label>
              <Input
                id="price-per-share"
                type="number"
                step="0.00001"
                value={pricePerShare}
                onChange={(e) => setPricePerShare(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: {(ordinal.floorPrice / totalShares).toFixed(8)} BTC (based on floor price)
              </p>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Your Ordinal will be locked in a multi-sig vault on Bitcoin L1. You'll receive{" "}
              {totalShares.toLocaleString()} ERC-20 tokens on Starknet representing fractional ownership.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isVaulting}>
            Cancel
          </Button>
          <Button onClick={handleVault} disabled={isVaulting} className="gap-2">
            {isVaulting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isVaulting ? "Vaulting..." : "Confirm & Vault"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
