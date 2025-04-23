import { createClient } from "@supabase/supabase-js"

// Criando um cliente Supabase para o lado do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Criando um singleton para evitar múltiplas instâncias
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
