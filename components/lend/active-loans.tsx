"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react"

interface Loan {
  id: string
  asset: string
  borrowed: number
  debt: number
  collateral: string
  collateralValue: number
  healthFactor: number
  apy: number
  liquidationPrice: number
}

export function ActiveLoans() {
  const loans: Loan[] = [
    {
      id: "1",
      asset: "USDC",
      borrowed: 8000,
      debt: 8032,
      collateral: "PUNK1234 (2,500 shares)",
      collateralValue: 0.15,
      healthFactor: 2.45,
      apy: 5.2,
      liquidationPrice: 0.000032,
    },
  ]

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 2) return "text-primary"
    if (hf >= 1.5) return "text-yellow-500"
    return "text-destructive"
  }

  const getHealthFactorStatus = (hf: number) => {
    if (hf >= 2) return "Safe"
    if (hf >= 1.5) return "Moderate"
    return "At Risk"
  }

  return (
    <div className="space-y-6">
      {loans.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Borrowed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,000 USDC</div>
                <p className="text-xs text-muted-foreground mt-1">≈ 0.08 BTC</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Debt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,032 USDC</div>
                <p className="text-xs text-muted-foreground mt-1">+32 USDC interest</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Health Factor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getHealthFactorColor(2.45)}`}>2.45</div>
                <p className="text-xs text-muted-foreground mt-1">Safe position</p>
              </CardContent>
            </Card>
          </div>

          {loans.map((loan) => (
            <Card key={loan.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Loan #{loan.id}</CardTitle>
                    <CardDescription>Borrowed {loan.asset}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      loan.healthFactor >= 2 ? "default" : loan.healthFactor >= 1.5 ? "secondary" : "destructive"
                    }
                  >
                    {getHealthFactorStatus(loan.healthFactor)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Borrowed Amount</div>
                      <div className="text-2xl font-bold">
                        {loan.borrowed.toLocaleString()} {loan.asset}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Current Debt</div>
                      <div className="text-xl font-bold text-destructive">
                        {loan.debt.toLocaleString()} {loan.asset}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Interest: +{(loan.debt - loan.borrowed).toFixed(2)} {loan.asset}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Borrow APY</div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-destructive" />
                        <span className="font-semibold">{loan.apy}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Collateral</div>
                      <div className="font-semibold">{loan.collateral}</div>
                      <div className="text-sm text-muted-foreground">Value: {loan.collateralValue.toFixed(4)} BTC</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Health Factor</div>
                      <div className={`text-3xl font-bold ${getHealthFactorColor(loan.healthFactor)}`}>
                        {loan.healthFactor.toFixed(2)}
                      </div>
                      <Progress value={Math.min((loan.healthFactor / 3) * 100, 100)} className="mt-2" />
                      <div className="text-xs text-muted-foreground mt-1">Liquidation at &lt; 1.0</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Liquidation Price</div>
                      <div className="font-semibold">{loan.liquidationPrice.toFixed(8)} BTC</div>
                      <div className="text-xs text-muted-foreground">per share</div>
                    </div>
                  </div>
                </div>

                {loan.healthFactor < 1.5 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Your health factor is low. Consider adding more collateral or repaying part of your loan to avoid
                      liquidation.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Add Collateral
                  </Button>
                  <Button className="flex-1">Repay Loan</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Active Loans</h3>
            <p className="text-center text-sm text-muted-foreground max-w-sm mb-6">
              You don't have any active loans. Supply collateral and borrow assets to get started.
            </p>
            <Button>Start Borrowing</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
