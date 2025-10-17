"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Droplets, Wallet, RefreshCw } from "lucide-react"
import { useState } from "react"
import { NetworkConfig, getFaucetUrl } from "@/lib/config/network"

export function TestnetFaucet() {
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({})
  const [copied, setCopied] = useState<string | null>(null)

  const isTestnet = NetworkConfig.isTestnet()

  const faucets = [
    {
      id: 'bitcoin',
      name: 'Bitcoin Testnet',
      description: 'Get testnet Bitcoin for Ordinals and gas fees',
      url: getFaucetUrl('bitcoin'),
      icon: '₿',
      color: 'bg-orange-500',
      steps: [
        'Enter your testnet Bitcoin address',
        'Complete the captcha',
        'Claim testnet BTC (usually arrives within minutes)'
      ]
    },
    {
      id: 'starknet',
      name: 'Starknet Testnet',
      description: 'Get testnet ETH for transaction fees',
      url: getFaucetUrl('starknet'),
      icon: 'Ξ',
      color: 'bg-blue-500',
      steps: [
        'Connect your Starknet wallet',
        'Verify your account (Twitter, Discord, or email)',
        'Claim testnet ETH (0.01 ETH per claim)'
      ]
    }
  ]

  const handleOpenFaucet = async (faucetId: string, url: string) => {
    setIsLoading(prev => ({ ...prev, [faucetId]: true }))

    try {
      // Open faucet in new tab
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Failed to open faucet:', error)
    } finally {
      setTimeout(() => {
        setIsLoading(prev => ({ ...prev, [faucetId]: false }))
      }, 2000)
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  if (!isTestnet) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Droplets className="h-4 w-4" />
        <AlertDescription className="text-blue-800">
          You are currently on mainnet. Switch to testnet mode to access faucet features.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Testnet Mode
          </Badge>
        </div>
        <h2 className="text-2xl font-bold mb-2">Testnet Faucets</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get free testnet tokens to experiment with the platform. These tokens have no real value and are only for testing purposes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faucets.map((faucet) => (
          <Card key={faucet.id} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${faucet.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {faucet.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{faucet.name}</CardTitle>
                  <CardDescription>{faucet.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">How to claim:</h4>
                <ol className="space-y-1 text-sm text-muted-foreground">
                  {faucet.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-medium text-primary">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <Button
                className="w-full"
                onClick={() => handleOpenFaucet(faucet.id, faucet.url)}
                disabled={isLoading[faucet.id]}
              >
                {isLoading[faucet.id] ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Opening...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open {faucet.name} Faucet
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Testnet Wallet Setup
          </CardTitle>
          <CardDescription>
            Quick setup instructions for testnet wallets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Xverse (Bitcoin)</h4>
              <div className="space-y-2 text-sm">
                <p>1. Install Xverse browser extension</p>
                <p>2. Switch to testnet in settings</p>
                <p>3. Create or import a testnet wallet</p>
                <p>4. Copy your testnet address for the faucet</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => window.open('https://xverse.app/', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Download Xverse
              </Button>
            </div>

            <div>
              <h4 className="font-medium mb-3">Argent/Braavos (Starknet)</h4>
              <div className="space-y-2 text-sm">
                <p>1. Install Argent or Braavos wallet</p>
                <p>2. Switch to Starknet testnet</p>
                <p>3. Create or import a testnet account</p>
                <p>4. Copy your testnet address for the faucet</p>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://www.argent.xyz/', '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Argent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://braavos.app/', '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Braavos
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Droplets className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Testnet tokens are free and have no real value. Use them for testing and development only.
          Never send real mainnet tokens to testnet addresses.
        </AlertDescription>
      </Alert>
    </div>
  )
}