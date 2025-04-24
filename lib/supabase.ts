import { createClient } from "@supabase/supabase-js"

// Criando um cliente Supabase para o lado do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY devem estar definidas",
  )
}

// Criando um singleton para evitar múltiplas instâncias
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return supabaseInstance
}

export const supabase = getSupabase()

// Função para debug - remover em produção
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log("Supabase connection check:", { data, error })
    return { data, error }
  } catch (e) {
    console.error("Supabase connection error:", e)
    return { data: null, error: e }
  }
}
