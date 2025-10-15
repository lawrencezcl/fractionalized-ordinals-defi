"use client"

import { Button } from "@/components/ui/button"
import { Wallet, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function VaultHeader() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")

  const handleConnect = async () => {
    // Simulate wallet connection
    setIsConnected(true)
    setAddress("bc1q...xyz123")
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Vault Ordinals</h1>
              <p className="text-sm text-muted-foreground">Deposit your Bitcoin Ordinals and mint fractional shares</p>
            </div>
          </div>

          <div>
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">{address}</div>
                  <div className="text-xs text-muted-foreground">Xverse Wallet</div>
                </div>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={handleConnect} className="gap-2">
                <Wallet className="h-4 w-4" />
                Connect Xverse Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
