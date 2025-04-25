"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const router = useRouter()

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
          router.push("/dashboard/aluno")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (err) {
      console.error("Erro ao verificar usuário demo:", err)
    }
  }, [router])

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
