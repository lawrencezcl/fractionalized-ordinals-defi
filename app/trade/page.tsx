import { TradeHeader } from "@/components/trade/trade-header"
import { TradeLayout } from "@/components/trade/trade-layout"

export default function TradePage() {
  return (
    <div className="min-h-screen">
      <TradeHeader />
      <TradeLayout />
    </div>
  )
}
