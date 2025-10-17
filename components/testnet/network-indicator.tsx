"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Network,
  TestTube,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw
} from "lucide-react"
import { useState } from "react"
import { NetworkConfig } from "@/lib/config/network"

export function NetworkIndicator() {
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const isTestnet = NetworkConfig.isTestnet()
  const networkName = NetworkConfig.getNetworkName()
  const networkColor = NetworkConfig.getNetworkColor()

  const checkNetworkStatus = async () => {
    setIsChecking(true)
    try {
      // Simulate network status check
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastChecked(new Date())
    } catch (error) {
      console.error('Error checking network status:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const getNetworkIcon = () => {
    if (isTestnet) {
      return <TestTube className="h-4 w-4" />
    } else {
      return <Network className="h-4 w-4" />
    }
  }

  const getStatusColor = () => {
    if (isTestnet) {
      return 'bg-orange-100 text-orange-800 border-orange-200'
    } else {
      return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  return (
    <div className="space-y-4">
      {/* Network Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={getStatusColor()}
          >
            {getNetworkIcon()}
            <span className="ml-1 font-medium">{networkName}</span>
          </Badge>

          {lastChecked && (
            <span className="text-xs text-muted-foreground">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={checkNetworkStatus}
          disabled={isChecking}
          className="h-8 px-2"
        >
          {isChecking ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Testnet Warning */}
      {isTestnet && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="space-y-2">
              <p className="font-medium">You are using Testnet</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Transactions use testnet tokens with no real value</li>
                <li>All Ordinals and fractional shares are for testing only</li>
                <li>Use testnet faucets to get free tokens</li>
                <li>Data may be reset periodically</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Network Information */}
      <div className="rounded-lg border p-4 space-y-3">
        <h4 className="font-medium">Network Information</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Bitcoin Network:</span>
            <div className="font-medium mt-1">
              {isTestnet ? 'Testnet' : 'Mainnet'}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6 px-2"
                onClick={() => window.open(
                  isTestnet ? 'https://blockstream.info/testnet/' : 'https://blockstream.info/',
                  '_blank'
                )}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div>
            <span className="text-muted-foreground">Starknet Network:</span>
            <div className="font-medium mt-1">
              {isTestnet ? 'Goerli Testnet' : 'Mainnet'}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6 px-2"
                onClick={() => window.open(
                  isTestnet ? 'https://testnet.starkscan.co/' : 'https://starkscan.co/',
                  '_blank'
                )}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">
            Connected to {networkName.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      {isTestnet && (
        <div className="space-y-2">
          <h4 className="font-medium">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/testnet/faucet', '_blank')}
            >
              <TestTube className="mr-2 h-4 w-4" />
              Get Testnet Funds
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://xverse.app/', '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Xverse Wallet
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.argent.xyz/', '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Argent Wallet
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}