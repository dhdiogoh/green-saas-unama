"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isConfigured: boolean
  error: Error | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isConfigured: false,
  error: null,
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    // Se o Supabase não estiver configurado, não tente autenticar
    if (!isConfigured) {
      setIsLoading(false)
      setError(new Error("Supabase não está configurado. Verifique as variáveis de ambiente."))
      return
    }

    // Verificar a sessão atual
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Erro ao obter sessão:", error)
          setError(error)
        } else {
          setSession(data.session)
          setUser(data.session?.user || null)
        }
      } catch (err) {
        console.error("Erro ao obter sessão:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Configurar listener para mudanças de autenticação
    let authListener: { subscription: { unsubscribe: () => void } } | null = null

    try {
      const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
        console.log("Auth state changed:", event)
        setSession(newSession)
        setUser(newSession?.user || null)
        setIsLoading(false)
      })
      authListener = data
    } catch (err) {
      console.error("Erro ao configurar listener de autenticação:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setIsLoading(false)
    }

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [isConfigured])

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isConfigured, error }}>{children}</AuthContext.Provider>
  )
}
