"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export default function Navbar() {
  const pathname = usePathname()
  const { items } = useCart()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Fresh Prep
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/menu"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/menu" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Menu
            </Link>
            <Link
              href="/faq"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/faq" ? "text-foreground" : "text-foreground/60"
              )}
            >
              FAQ
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Link href="/cart">
            <Button variant="ghost" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {mounted && items.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  )
}