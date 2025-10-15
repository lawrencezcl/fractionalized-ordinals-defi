"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Vault } from "lucide-react"
import { ImageIcon } from "lucide-react"
import { useState } from "react"
import { VaultDialog } from "./vault-dialog"

interface Ordinal {
  id: string
  name: string
  inscription: string
  collection: string
  floorPrice: number
  image: string
}

export function MyOrdinals() {
  const [selectedOrdinal, setSelectedOrdinal] = useState<Ordinal | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Mock data
  const ordinals: Ordinal[] = [
    {
      id: "1",
      name: "Bitcoin Punk #1234",
      inscription: "a1b2c3d4e5f6...",
      collection: "Bitcoin Punks",
      floorPrice: 0.5,
      image: "/bitcoin-punk-nft.jpg",
    },
    {
      id: "2",
      name: "Ordinal Monkey #567",
      inscription: "f6e5d4c3b2a1...",
      collection: "Ordinal Monkeys",
      floorPrice: 0.3,
      image: "/abstract-monkey-nft.png",
    },
    {
      id: "3",
      name: "BTC Rock #89",
      inscription: "9876543210ab...",
      collection: "BTC Rocks",
      floorPrice: 1.2,
      image: "/rock-nft.jpg",
    },
  ]

  const handleVault = (ordinal: Ordinal) => {
    setSelectedOrdinal(ordinal)
    setDialogOpen(true)
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
                src={ordinal.image || "/placeholder.svg"}
                alt={ordinal.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{ordinal.name}</CardTitle>
                  <CardDescription className="truncate">{ordinal.collection}</CardDescription>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {ordinal.floorPrice} BTC
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground mb-1">Inscription ID</div>
                <div className="font-mono text-sm truncate">{ordinal.inscription}</div>
              </div>
              <Button onClick={() => handleVault(ordinal)} className="w-full gap-2">
                <Vault className="h-4 w-4" />
                Vault & Fractionalize
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
            <h3 className="mb-2 text-lg font-semibold">No Ordinals Found</h3>
            <p className="text-center text-sm text-muted-foreground max-w-sm">
              Connect your Xverse wallet to view your Bitcoin Ordinals
            </p>
          </CardContent>
        </Card>
      )}

      {selectedOrdinal && <VaultDialog ordinal={selectedOrdinal} open={dialogOpen} onOpenChange={setDialogOpen} />}
    </>
  )
}
