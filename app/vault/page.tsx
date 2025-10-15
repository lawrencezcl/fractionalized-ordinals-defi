import { VaultHeader } from "@/components/vault/vault-header"
import { VaultTabs } from "@/components/vault/vault-tabs"

export default function VaultPage() {
  return (
    <div className="min-h-screen">
      <VaultHeader />
      <main className="container py-8">
        <VaultTabs />
      </main>
    </div>
  )
}
