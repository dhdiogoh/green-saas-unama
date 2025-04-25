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
      console.log("Supabase não está configurado, usando modo de demonstração")
      setIsLoading(false)
      setError(new Error("Supabase não está configurado. Verifique as variáveis de ambiente."))

      // Verificar se há um usuário demo no localStorage
      try {
        const demoUserStr = localStorage.getItem("demo-user")
        if (demoUserStr) {
          const demoUser = JSON.parse(demoUserStr)
          console.log("Usuário demo encontrado:", demoUser)
        }
      } catch (err) {
        console.error("Erro ao verificar usuário demo:", err)
      }

      return
    }

    console.log("AuthProvider: Inicializando...")
    setIsLoading(true)

    // Função para obter a sessão atual
    const getCurrentSession = async () => {
      try {
        // Usar try-catch para cada operação do Supabase
        try {
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error("Erro ao obter sessão:", error)
            setError(error)
            setIsLoading(false)
            return
          }

          console.log("Sessão obtida:", data)
          setSession(data.session)
          setUser(data.session?.user || null)
        } catch (sessionError) {
          console.error("Exceção ao obter sessão:", sessionError)
          setError(sessionError instanceof Error ? sessionError : new Error(String(sessionError)))
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Obter a sessão inicial
    getCurrentSession()

    // Configurar o listener de autenticação
    let authListener: { subscription: { unsubscribe: () => void } } | null = null

    try {
      const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
        console.log("Evento de autenticação:", event)

        if (event === "SIGNED_OUT") {
          setUser(null)
          setSession(null)
        } else if (newSession) {
          setUser(newSession.user)
          setSession(newSession)
        }

        setIsLoading(false)
      })

      authListener = data
    } catch (listenerError) {
      console.error("Erro ao configurar listener de autenticação:", listenerError)
      setError(listenerError instanceof Error ? listenerError : new Error(String(listenerError)))
      setIsLoading(false)
    }

    // Limpar o listener quando o componente for desmontado
    return () => {
      if (authListener) {
        try {
          authListener.subscription.unsubscribe()
        } catch (unsubError) {
          console.error("Erro ao cancelar inscrição do listener:", unsubError)
        }
      }
    }
  }, [isConfigured])

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isConfigured, error }}>{children}</AuthContext.Provider>
  )
}
