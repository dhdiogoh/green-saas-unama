"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export function UserNav() {
  const router = useRouter()
  const [userName, setUserName] = useState("Usuário")
  const [userEmail, setUserEmail] = useState("")
  const [userType, setUserType] = useState<string | null>(null)
  const [instituicao, setInstituicao] = useState<string | null>(null)
  const [turma, setTurma] = useState<string | null>(null)
  const [curso, setCurso] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Verificar se estamos em modo de demonstração
    const checkDemoMode = () => {
      if (!isSupabaseConfigured()) {
        setIsDemoMode(true)
        // Tentar obter dados do usuário demo do localStorage
        try {
          const demoUserStr = localStorage.getItem("demo-user")
          if (demoUserStr) {
            const demoUser = JSON.parse(demoUserStr)
            setUserEmail(demoUser.email || "")
            const metadata = demoUser.user_metadata || {}
            setUserType(metadata.tipo_usuario || metadata.user_type || "instituicao")
            setInstituicao(metadata.instituicao || null)
            setTurma(metadata.turma || null)
            setCurso(metadata.curso || null)

            // Definir nome do usuário com base no email
            if (demoUser.email) {
              const emailParts = demoUser.email.split("@")
              if (emailParts.length > 0) {
                const namePart = emailParts[0]
                // Capitalizar primeira letra de cada palavra
                const formattedName = namePart
                  .split(/[._-]/)
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(" ")
                setUserName(formattedName)
              }
            }
          }
        } catch (err) {
          console.error("Erro ao obter usuário demo:", err)
        }
        return true
      }
      return false
    }

    // Se não estamos em modo de demonstração, buscar informações do usuário atual
    const getUserInfo = async () => {
      if (checkDemoMode()) return

      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Erro ao obter usuário:", error)
          return
        }

        if (data.user) {
          // Obter o nome do usuário dos metadados
          const metadata = data.user.user_metadata || {}
          const fullName = metadata.full_name
          if (fullName) {
            setUserName(fullName)
          } else if (data.user.email) {
            // Se não tiver nome completo, usar parte do email
            const emailParts = data.user.email.split("@")
            if (emailParts.length > 0) {
              const namePart = emailParts[0]
              // Capitalizar primeira letra de cada palavra
              const formattedName = namePart
                .split(/[._-]/)
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" ")
              setUserName(formattedName)
            }
          }

          // Definir o email
          if (data.user.email) {
            setUserEmail(data.user.email)
          }

          // Definir o tipo de usuário e outras informações
          setUserType(metadata.tipo_usuario || metadata.user_type || "instituicao")
          setInstituicao(metadata.instituicao || null)
          setTurma(metadata.turma || null)
          setCurso(metadata.curso || null)
        }
      } catch (err) {
        console.error("Erro ao carregar informações do usuário:", err)
      }
    }

    getUserInfo()
  }, [])

  const handleLogout = async () => {
    try {
      if (isDemoMode) {
        // Em modo de demonstração, apenas limpar o localStorage
        localStorage.removeItem("demo-user")
      } else {
        // Logout normal do Supabase
        await supabase.auth.signOut()
      }
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  // Obter as iniciais do nome para o avatar
  const getInitials = () => {
    if (userName === "Usuário") return "U"

    const nameParts = userName.split(" ")
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/mystical-forest-spirit.png" alt="Avatar" />
            <AvatarFallback className="bg-green-700 text-white">{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
            <p className="text-xs font-medium text-emerald-600 mt-1">
              {userType === "aluno" ? "Aluno" : "Instituição"}
            </p>
            {isDemoMode && <p className="text-xs font-medium text-amber-600 mt-1">Modo de Demonstração</p>}
            {userType === "aluno" && instituicao && (
              <div className="mt-1 text-xs text-gray-500">
                <p>{instituicao}</p>
                {curso && turma && (
                  <p>
                    {curso} | {turma}
                  </p>
                )}
              </div>
            )}
            {userType === "instituicao" && instituicao && (
              <div className="mt-1 text-xs text-gray-500">
                <p>{instituicao}</p>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
          {userType !== "aluno" && <DropdownMenuItem>Gerenciar Usuários</DropdownMenuItem>}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
