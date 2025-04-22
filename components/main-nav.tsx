"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Recycle } from "lucide-react"

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10 items-center">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <Recycle className="h-6 w-6 text-white" />
        <span className="hidden font-bold text-white sm:inline-block">Green SaaS</span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-white/80",
            pathname === "/dashboard" ? "text-white" : "text-white/60",
          )}
        >
          Início
        </Link>
        <Link
          href="/dashboard/nova-entrega"
          className={cn(
            "text-sm font-medium transition-colors hover:text-white/80",
            pathname === "/dashboard/nova-entrega" ? "text-white" : "text-white/60",
          )}
        >
          Nova Entrega
        </Link>
        <Link
          href="/dashboard/historico"
          className={cn(
            "text-sm font-medium transition-colors hover:text-white/80",
            pathname === "/dashboard/historico" ? "text-white" : "text-white/60",
          )}
        >
          Histórico
        </Link>
      </nav>
    </div>
  )
}
