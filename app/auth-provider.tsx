"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar a sessão atual
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Erro ao obter sessão:", error)
      }

      setSession(data.session)
      setUser(data.session?.user || null)
      setIsLoading(false)
    }

    getSession()

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event)
      setSession(newSession)
      setUser(newSession?.user || null)
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, session, isLoading }}>{children}</AuthContext.Provider>
}
