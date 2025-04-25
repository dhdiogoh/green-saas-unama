"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
  user: any | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um usuário demo no localStorage
    try {
      const demoUserStr = localStorage.getItem("demo-user")
      if (demoUserStr) {
        const demoUser = JSON.parse(demoUserStr)
        setUser(demoUser)

        // Definir um cookie para o middleware - garantir que seja definido em todos os ambientes
        document.cookie = "demo-user=true; path=/; max-age=86400; SameSite=Lax"
      }
    } catch (err) {
      console.error("Erro ao verificar usuário demo:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}
