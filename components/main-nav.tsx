"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Recycle, BarChart3, HelpCircle } from "lucide-react"

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10 items-center">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <Recycle className="h-6 w-6 text-white" />
        <span className="hidden font-bold text-white sm:inline-block">Green SaaS</span>
        <span className="hidden text-xs bg-white/20 px-2 py-0.5 rounded text-white ml-1 sm:inline-block">Admin</span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-white/80",
            pathname === "/dashboard" ? "text-white" : "text-white/60",
          )}
        >
          <span className="flex items-center">
            <BarChart3 className="mr-1 h-4 w-4" />
            Dashboard
          </span>
        </Link>
        <Link
          href="/dashboard/nova-entrega"
          className={cn(
            "text-sm font-medium transition-colors hover:text-white/80",
            pathname === "/dashboard/nova-entrega" ? "text-white" : "text-white/60",
          )}
        >
          <span className="flex items-center">
            <Recycle className="mr-1 h-4 w-4" />
            Nova Entrega
          </span>
        </Link>
        <Link
          href="/dashboard/ajuda"
          className={cn(
            "text-sm font-medium transition-colors hover:text-white/80",
            pathname === "/dashboard/ajuda" ? "text-white" : "text-white/60",
          )}
        >
          <span className="flex items-center">
            <HelpCircle className="mr-1 h-4 w-4" />
            Ajuda
          </span>
        </Link>
      </nav>
    </div>
  )
}
