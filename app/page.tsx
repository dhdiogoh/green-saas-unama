"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se o usuário já está logado e redirecionar para o dashboard apropriado
  useEffect(() => {
    try {
      const demoUserStr = localStorage.getItem("demo-user")
      if (demoUserStr) {
        const demoUser = JSON.parse(demoUserStr)
        const metadata = demoUser.user_metadata || {}
        const userType = metadata.tipo_usuario || metadata.user_type

        // Redirecionar com base no tipo de usuário
        if (userType === "aluno") {
          window.location.href = "/dashboard/aluno"
        } else if (userType === "instituicao") {
          window.location.href = "/dashboard"
        } else {
          // Se não tiver tipo definido, limpar o localStorage para evitar redirecionamentos incorretos
          localStorage.removeItem("demo-user")
          document.cookie = "demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        }
      }
      setIsLoading(false)
    } catch (err) {
      console.error("Erro ao verificar usuário demo:", err)
      // Em caso de erro, limpar o localStorage para evitar redirecionamentos incorretos
      localStorage.removeItem("demo-user")
      document.cookie = "demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-900">
        <div className="text-center">Carregando...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}
