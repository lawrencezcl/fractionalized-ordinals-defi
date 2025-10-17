import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"
import { NetworkIndicator } from "@/components/testnet/network-indicator"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Coins className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">OrdinalVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/vault"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Vault
          </Link>
          <Link
            href="/trade"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Trade
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <NetworkIndicator />
          </div>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            Connect Wallet
          </Button>
          <Button size="sm">Launch App</Button>
        </div>
      </div>
    </header>
  )
}
