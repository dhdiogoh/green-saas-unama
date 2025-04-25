import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Criar cliente Supabase
    const supabase = createRouteHandlerClient({ cookies })

    // Buscar todos os cursos ativos
    const { data, error } = await supabase.from("cursos").select("*").eq("ativo", true).order("nome")

    if (error) {
      console.error("Erro ao buscar cursos:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("Erro no servidor:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
