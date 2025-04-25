import { createClient } from "@supabase/supabase-js"

// Criando um cliente Supabase para o lado do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY devem estar definidas",
  )
}

// Singleton para o cliente Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (typeof window === "undefined") {
    // Servidor: criar uma nova instância cada vez
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  }

  // Cliente: usar singleton
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "greensaas-auth-token",
      },
    })
  }
  return supabaseInstance
}

// Exportando o cliente Supabase
export const supabase = getSupabase() || createClient("", "", { auth: { persistSession: false } })

// Função para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey
}

// Função para debug - remover em produção
export const checkSupabaseConnection = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: new Error("Supabase não está configurado. Verifique as variáveis de ambiente."),
      }
    }

    const { data, error } = await supabase.auth.getSession()
    console.log("Supabase connection check:", { data, error })
    return { data, error }
  } catch (e) {
    console.error("Supabase connection error:", e)
    return { data: null, error: e }
  }
}
