"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Recycle, BarChart3, HelpCircle, Trophy, MapPin, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function MainNav() {
  const pathname = usePathname()
  const [userType, setUserType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUserType = async () => {
      try {
        setIsLoading(true)

        // Tentar obter do localStorage primeiro (para modo de demonstração)
        const demoUserStr = localStorage.getItem("demo-user")
        if (demoUserStr) {
          try {
            const demoUser = JSON.parse(demoUserStr)
            const metadata = demoUser.user_metadata || {}
            setUserType(metadata.user_type || metadata.tipo_usuario || "instituicao")
            setIsLoading(false)
            return
          } catch (err) {
            console.error("Erro ao processar usuário demo:", err)
          }
        }

        // Se não encontrou no localStorage, tentar do Supabase
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Erro ao obter sessão:", error)
          setUserType("instituicao") // Valor padrão em caso de erro
          return
        }

        if (data.session) {
          const metadata = data.session.user.user_metadata || {}
          setUserType(metadata.user_type || metadata.tipo_usuario || "instituicao")
        } else {
          setUserType("instituicao") // Valor padrão se não houver sessão
        }
      } catch (err) {
        console.error("Erro ao carregar tipo de usuário:", err)
        setUserType("instituicao") // Valor padrão em caso de erro
      } finally {
        setIsLoading(false)
      }
    }

    getUserType()
  }, [])

  if (isLoading) {
    return (
      <div className="flex gap-6 md:gap-10 items-center">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Recycle className="h-6 w-6 text-white" />
          <span className="hidden font-bold text-white sm:inline-block">Green SaaS</span>
        </Link>
      </div>
    )
  }

  const isAluno = userType === "aluno"
  const dashboardPath = isAluno ? "/dashboard/aluno" : "/dashboard"
  const rankingPath = isAluno ? "/dashboard/aluno/ranking" : "/dashboard/turmas"
  const ajudaPath = isAluno ? "/dashboard/aluno/ajuda" : "/dashboard/ajuda"
  const pontosColetaPath = "/dashboard/aluno/pontos-coleta"

  return (
    <div className="flex gap-6 md:gap-10 items-center">
      <Link href={dashboardPath} className="flex items-center space-x-2">
        <Recycle className="h-6 w-6 text-white" />
        <span className="hidden font-bold text-white sm:inline-block">Green SaaS</span>
        <span className="hidden text-xs bg-white/20 px-2 py-0.5 rounded text-white ml-1 sm:inline-block">
          {isAluno ? "Aluno" : "Admin"}
        </span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href={dashboardPath}
          className={cn(
            "text-sm font-medium transition-colors hover:text-white/80",
            pathname === dashboardPath || pathname === "/dashboard" ? "text-white" : "text-white/60",
          )}
        >
          <span className="flex items-center">
            <BarChart3 className="mr-1 h-4 w-4" />
            Dashboard
          </span>
        </Link>

        {/* Only show Nova Entrega for admin users */}
        {!isAluno && (
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
        )}

        <Link
          href={rankingPath}
          className={cn(
            "text-sm font-medium transition-colors hover:text-white/80",
            pathname === rankingPath || pathname === "/dashboard/turmas" ? "text-white" : "text-white/60",
          )}
        >
          <span className="flex items-center">
            <Trophy className="mr-1 h-4 w-4" />
            Ranking
          </span>
        </Link>

        {isAluno && (
          <Link
            href={pontosColetaPath}
            className={cn(
              "text-sm font-medium transition-colors hover:text-white/80",
              pathname === pontosColetaPath ? "text-white" : "text-white/60",
            )}
          >
            <span className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              Pontos de Coleta
            </span>
          </Link>
        )}

        <Link
          href={ajudaPath}
          className={cn(
            "text-sm font-medium transition-colors hover:text-white/80",
            pathname === "/dashboard/ajuda" || pathname === "/dashboard/aluno/ajuda" ? "text-white" : "text-white/60",
          )}
        >
          <span className="flex items-center">
            <HelpCircle className="mr-1 h-4 w-4" />
            Ajuda
          </span>
        </Link>
        {!isAluno && (
          <Link
            href="/dashboard/api-docs"
            className={cn(
              "text-sm font-medium transition-colors hover:text-white/80",
              pathname === "/dashboard/api-docs" ? "text-white" : "text-white/60",
            )}
          >
            <span className="flex items-center">
              <Code className="mr-1 h-4 w-4" />
              API Docs
            </span>
          </Link>
        )}
      </nav>
    </div>
  )
}
