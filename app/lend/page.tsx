import { LendHeader } from "@/components/lend/lend-header"
import { LendingDashboard } from "@/components/lend/lending-dashboard"

export default function LendPage() {
  return (
    <div className="min-h-screen">
      <LendHeader />
      <main className="container py-8">
        <LendingDashboard />
      </main>
    </div>
  )
}
