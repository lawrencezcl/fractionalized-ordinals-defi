"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Vault } from "lucide-react"
import { ImageIcon } from "lucide-react"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { VaultDialog } from "./vault-dialog"
import { xverseWallet, Inscription } from "@/lib/wallets/xverse"
import { ordinalsPriceOracle } from "@/lib/oracles/price-oracle"

interface OrdinalWithPrice extends Inscription {
  floorPrice: number
  displayImage: string
}

export function MyOrdinals() {
  const [selectedOrdinal, setSelectedOrdinal] = useState<OrdinalWithPrice | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [ordinals, setOrdinals] = useState<OrdinalWithPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [walletConnected, setWalletConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrdinals()
  }, [])

  const loadOrdinals = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if wallet is connected
      if (!xverseWallet.isAvailable()) {
        throw new Error('Xverse wallet is not available. Please install the Xverse extension.')
      }

      const walletState = xverseWallet.getState()
      if (!walletState.isConnected) {
        setWalletConnected(false)
        setIsLoading(false)
        return
      }

      // Get supported Ordinals from wallet
      const supportedOrdinals = await xverseWallet.getSupportedInscriptions()

      // Fetch floor prices for each collection
      const ordinalsWithPrices: OrdinalWithPrice[] = await Promise.all(
        supportedOrdinals.map(async (inscription) => {
          let floorPrice = 0

          if (inscription.collection) {
            try {
              const priceResult = await ordinalsPriceOracle.getFloorPrice(inscription.collection.name)
              if (priceResult.success && priceResult.data) {
                // Convert from satoshis to BTC
                floorPrice = priceResult.data.floorPrice / 100000000
              }
            } catch (priceError) {
              console.warn('Failed to fetch floor price for collection:', inscription.collection.name)
            }
          }

          return {
            ...inscription,
            floorPrice,
            displayImage: inscription.preview || "/placeholder.svg"
          }
        })
      )

      setOrdinals(ordinalsWithPrices)
      setWalletConnected(true)
    } catch (error) {
      console.error('Error loading ordinals:', error)
      setError(error instanceof Error ? error.message : 'Failed to load ordinals')
    } finally {
      setIsLoading(false)
    }
  }

  const connectWallet = async () => {
    try {
      await xverseWallet.connect()
      await loadOrdinals()
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setError(error instanceof Error ? error.message : 'Failed to connect wallet')
    }
  }

  const handleVault = (ordinal: OrdinalWithPrice) => {
    setSelectedOrdinal(ordinal)
    setDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your Ordinals...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 text-center">
            <h3 className="mb-2 text-lg font-semibold text-destructive">Error Loading Ordinals</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadOrdinals}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!walletConnected) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Vault className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Connect Your Wallet</h3>
          <p className="text-center text-sm text-muted-foreground mb-4 max-w-sm">
            Connect your Xverse wallet to view and vault your Bitcoin Ordinals
          </p>
          <Button onClick={connectWallet} className="gap-2">
            <Vault className="h-4 w-4" />
            Connect Xverse Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Your Ordinals</h2>
        <p className="text-sm text-muted-foreground">Select an Ordinal to vault and fractionalize</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ordinals.map((ordinal) => (
          <Card key={ordinal.id} className="overflow-hidden">
            <div className="aspect-square relative bg-muted">
              <img
                src={ordinal.displayImage}
                alt={ordinal.collection?.name || 'Ordinal'}
                className="h-full w-full object-cover"
              />
              {ordinal.collection && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-background/80">
                    {ordinal.collection.name}
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {ordinal.collection?.name || 'Unknown Collection'} #{ordinal.inscription_number}
                  </CardTitle>
                  <CardDescription className="truncate">
                    Inscription #{ordinal.inscription_number}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {ordinal.floorPrice > 0 ? `${ordinal.floorPrice.toFixed(4)} BTC` : 'Price unavailable'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground mb-1">Inscription ID</div>
                <div className="font-mono text-sm truncate">{ordinal.id}</div>
              </div>
              <Button
                onClick={() => handleVault(ordinal)}
                className="w-full gap-2"
                disabled={ordinal.floorPrice === 0}
              >
                <Vault className="h-4 w-4" />
                {ordinal.floorPrice === 0 ? 'Price Unavailable' : 'Vault & Fractionalize'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {ordinals.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Supported Ordinals Found</h3>
            <p className="text-center text-sm text-muted-foreground max-w-sm">
              You don't have any Ordinals from supported collections. Currently supported: Bitcoin Punks, NodeMonkes, Bitcoin Frogs, Rocks, DeGods, and more.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedOrdinal && (
        <VaultDialog
          ordinal={{
            id: selectedOrdinal.id,
            name: `${selectedOrdinal.collection?.name || 'Unknown'} #${selectedOrdinal.inscription_number}`,
            floorPrice: selectedOrdinal.floorPrice,
            image: selectedOrdinal.displayImage
          }}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  )
}
