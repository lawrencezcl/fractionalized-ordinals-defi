import { TestnetFaucet } from "@/components/testnet/testnet-faucet"
import { NetworkIndicator } from "@/components/testnet/network-indicator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TestTube,
  ExternalLink,
  FileText,
  Code,
  Settings,
  CheckCircle,
  AlertTriangle,
  BookOpen
} from "lucide-react"
import Link from "next/link"

export default function TestnetPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  <TestTube className="mr-1 h-3 w-3" />
                  Testnet Environment
                </Badge>
                <h1 className="text-3xl font-bold">Testnet Dashboard</h1>
              </div>
              <p className="text-muted-foreground">
                Complete testing environment for Fractionalized Ordinals DeFi Platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Network Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Network Configuration
                </CardTitle>
                <CardDescription>
                  Current network status and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkIndicator />
              </CardContent>
            </Card>

            {/* Testnet Faucets */}
            <TestnetFaucet />

            {/* Testnet Features */}
            <Card>
              <CardHeader>
                <CardTitle>Testnet Features</CardTitle>
                <CardDescription>
                  Available testing features and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Bitcoin Testnet</h4>
                        <p className="text-sm text-muted-foreground">
                          Test Ordinals, vault creation, and transactions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Starknet Testnet</h4>
                        <p className="text-sm text-muted-foreground">
                          Smart contracts, fractional shares, and DeFi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Price Oracle</h4>
                        <p className="text-sm text-muted-foreground">
                          Mock price feeds for testing
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Vesu Integration</h4>
                        <p className="text-sm text-muted-foreground">
                          Test lending and borrowing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Ekubo DEX</h4>
                        <p className="text-sm text-muted-foreground">
                          Test trading and liquidity
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">No Real Value</h4>
                        <p className="text-sm text-muted-foreground">
                          All tokens are for testing only
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/vault">
                    Test Vault Creation
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/trade">
                    Test Trading
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/lend">
                    Test Lending
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/docs/testnet" className="text-left justify-start">
                        Testnet Documentation
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/docs/api" className="text-left justify-start">
                        API Documentation
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/docs/smart-contracts" className="text-left justify-start">
                        Smart Contracts
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testnet Status */}
            <Card>
              <CardHeader>
                <CardTitle>Testnet Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bitcoin Testnet</span>
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Starknet Testnet</span>
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price Feeds</span>
                    <Badge variant="outline" className="text-blue-600">
                      Mock
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>DeFi Protocols</span>
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* External Links */}
            <Card>
              <CardHeader>
                <CardTitle>External Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="https://blockstream.info/testnet/" target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Bitcoin Explorer
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="https://testnet.starkscan.co/" target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Starknet Explorer
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="https://faucet.sepolia.starknet.io/" target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Starknet Faucet
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Alert */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Testnet Disclaimer:</strong> This is a testing environment. All transactions use testnet tokens that have no real monetary value.
            Never send mainnet funds to testnet addresses.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}