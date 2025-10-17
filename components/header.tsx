"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Coins, Menu, X } from "lucide-react"
import { NetworkIndicator } from "@/components/testnet/network-indicator"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Coins className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">OrdinalVault</span>
        </Link>

        {/* Desktop Navigation */}
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
            href="/lend"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Lend
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
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
            data-testid="connect-wallet-button"
          >
            Connect Wallet
          </Button>
          <Button size="sm">Launch App</Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container py-4 space-y-2">
            <Link
              href="#features"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/vault"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vault
            </Link>
            <Link
              href="/trade"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trade
            </Link>
            <Link
              href="/lend"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Lend
            </Link>
            <Link
              href="/docs"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <div className="pt-2 border-t border-border/40">
              <NetworkIndicator />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
