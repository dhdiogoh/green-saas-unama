"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Recycle, BarChart3, HelpCircle, Trophy, MapPin, Code, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav() {
  const pathname = usePathname()
  const [userType, setUserType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  // Função para verificar se um link está ativo
  const isActive = (path: string) => {
    return (
      pathname === path ||
      (path !== dashboardPath && pathname.startsWith(path)) ||
      (path === dashboardPath && pathname === "/dashboard")
    )
  }

  // Links de navegação para desktop e mobile
  const navLinks = [
    {
      name: "Dashboard",
      path: dashboardPath,
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
    },
    // Apenas mostrar Nova Entrega para admin
    ...(!isAluno
      ? [
          {
            name: "Nova Entrega",
            path: "/dashboard/nova-entrega",
            icon: <Recycle className="h-4 w-4 mr-2" />,
          },
        ]
      : []),
    {
      name: "Ranking",
      path: rankingPath,
      icon: <Trophy className="h-4 w-4 mr-2" />,
    },
    // Apenas mostrar Pontos de Coleta para alunos
    ...(isAluno
      ? [
          {
            name: "Pontos de Coleta",
            path: pontosColetaPath,
            icon: <MapPin className="h-4 w-4 mr-2" />,
          },
        ]
      : []),
    {
      name: "Ajuda",
      path: ajudaPath,
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
    },
    // Apenas mostrar API Docs para admin
    ...(!isAluno
      ? [
          {
            name: "API Docs",
            path: "/dashboard/api-docs",
            icon: <Code className="h-4 w-4 mr-2" />,
          },
        ]
      : []),
  ]

  return (
    <div className="flex w-full justify-between items-center">
      {/* Logo e título - sempre visível */}
      <Link href={dashboardPath} className="flex items-center space-x-2">
        <Recycle className="h-6 w-6 text-white" />
        <span className="font-bold text-white">Green SaaS</span>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white ml-1">{isAluno ? "Aluno" : "Admin"}</span>
      </Link>

      {/* Menu de navegação para desktop */}
      <nav className="hidden md:flex gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={cn(
              "text-sm font-medium transition-colors hover:text-white/80",
              isActive(link.path) ? "text-white" : "text-white/60",
            )}
          >
            <span className="flex items-center">
              {link.icon}
              {link.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Menu hamburguer para mobile */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white p-2 h-10 w-10 flex items-center justify-center relative z-50"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px] bg-emerald-600 text-white border-l-emerald-700">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 mt-2">
                <div className="flex items-center space-x-2">
                  <Recycle className="h-6 w-6 text-white" />
                  <span className="font-bold text-white">Green SaaS</span>
                </div>
              </div>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-md transition-colors",
                      isActive(link.path)
                        ? "bg-emerald-700 text-white"
                        : "text-white/80 hover:bg-emerald-700/50 hover:text-white",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-6 text-center text-sm text-white/60">
                <p>Green SaaS v1.0</p>
                <p className="mt-1">© 2025 Unama</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
