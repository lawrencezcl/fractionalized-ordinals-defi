"use client"

import { useState } from "react"
import { MarketList } from "./market-list"
import { TradingPanel } from "./trading-panel"
import { PriceChart } from "./price-chart"
import { OrderBook } from "./order-book"
import { TradeHistory } from "./trade-history"
import { Portfolio } from "./portfolio"

export function TradeLayout() {
  const [selectedMarket, setSelectedMarket] = useState("PUNK1234")

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left sidebar - Market list */}
        <div className="lg:col-span-3">
          <MarketList selectedMarket={selectedMarket} onSelectMarket={setSelectedMarket} />
        </div>

        {/* Main content */}
        <div className="lg:col-span-6 space-y-6">
          <PriceChart market={selectedMarket} />
          <TradingPanel market={selectedMarket} />
          <TradeHistory market={selectedMarket} />
        </div>

        {/* Right sidebar - Order book & Portfolio */}
        <div className="lg:col-span-3 space-y-6">
          <OrderBook market={selectedMarket} />
          <Portfolio />
        </div>
      </div>
    </div>
  )
}
