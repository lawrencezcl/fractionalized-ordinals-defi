"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OrderBookProps {
  market: string
}

interface Order {
  price: number
  amount: number
  total: number
}

export function OrderBook({ market }: OrderBookProps) {
  const buyOrders: Order[] = [
    { price: 0.00006, amount: 1500, total: 0.09 },
    { price: 0.000059, amount: 2000, total: 0.118 },
    { price: 0.000058, amount: 1800, total: 0.1044 },
    { price: 0.000057, amount: 2200, total: 0.1254 },
    { price: 0.000056, amount: 1600, total: 0.0896 },
  ]

  const sellOrders: Order[] = [
    { price: 0.000061, amount: 1400, total: 0.0854 },
    { price: 0.000062, amount: 1900, total: 0.1178 },
    { price: 0.000063, amount: 1700, total: 0.1071 },
    { price: 0.000064, amount: 2100, total: 0.1344 },
    { price: 0.000065, amount: 1500, total: 0.0975 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="sell">Sell</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="px-6 py-2 grid grid-cols-3 text-xs text-muted-foreground">
              <div>Price</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Total</div>
            </div>

            {/* Sell orders */}
            <div className="space-y-1 px-6">
              {sellOrders.reverse().map((order, i) => (
                <div key={i} className="grid grid-cols-3 text-xs py-1 hover:bg-muted/50 cursor-pointer">
                  <div className="text-destructive font-mono">{order.price.toFixed(8)}</div>
                  <div className="text-right">{order.amount.toLocaleString()}</div>
                  <div className="text-right">{order.total.toFixed(4)}</div>
                </div>
              ))}
            </div>

            {/* Spread */}
            <div className="px-6 py-3 bg-muted/30 text-center">
              <div className="text-lg font-bold text-primary">0.00006</div>
              <div className="text-xs text-muted-foreground">Spread: 0.000001</div>
            </div>

            {/* Buy orders */}
            <div className="space-y-1 px-6">
              {buyOrders.map((order, i) => (
                <div key={i} className="grid grid-cols-3 text-xs py-1 hover:bg-muted/50 cursor-pointer">
                  <div className="text-primary font-mono">{order.price.toFixed(8)}</div>
                  <div className="text-right">{order.amount.toLocaleString()}</div>
                  <div className="text-right">{order.total.toFixed(4)}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buy" className="mt-0">
            <div className="px-6 py-2 grid grid-cols-3 text-xs text-muted-foreground">
              <div>Price</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Total</div>
            </div>
            <div className="space-y-1 px-6 pb-4">
              {buyOrders.map((order, i) => (
                <div key={i} className="grid grid-cols-3 text-xs py-1 hover:bg-muted/50 cursor-pointer">
                  <div className="text-primary font-mono">{order.price.toFixed(8)}</div>
                  <div className="text-right">{order.amount.toLocaleString()}</div>
                  <div className="text-right">{order.total.toFixed(4)}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sell" className="mt-0">
            <div className="px-6 py-2 grid grid-cols-3 text-xs text-muted-foreground">
              <div>Price</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Total</div>
            </div>
            <div className="space-y-1 px-6 pb-4">
              {sellOrders.map((order, i) => (
                <div key={i} className="grid grid-cols-3 text-xs py-1 hover:bg-muted/50 cursor-pointer">
                  <div className="text-destructive font-mono">{order.price.toFixed(8)}</div>
                  <div className="text-right">{order.amount.toLocaleString()}</div>
                  <div className="text-right">{order.total.toFixed(4)}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
