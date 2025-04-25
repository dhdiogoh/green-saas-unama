import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Criar cliente Supabase
    const supabase = createRouteHandlerClient({ cookies })

    // Obter parâmetros da URL
    const { searchParams } = new URL(request.url)
    const cursoId = searchParams.get("curso_id")
    const unidadeId = searchParams.get("unidade_id")
    const semestre = searchParams.get("semestre")

    // Usar a view turmas_detalhadas para obter informações completas
    let query = supabase.from("turmas_detalhadas").select("*")

    if (cursoId) {
      query = query.eq("curso_id", cursoId)
    }

    if (unidadeId) {
      query = query.eq("unidade_id", unidadeId)
    }

    if (semestre) {
      query = query.eq("semestre", semestre)
    }

    // Ordenar por unidade, curso e código da turma
    query = query.order("unidade_nome").order("curso_nome").order("turma_codigo")

    const { data, error, status } = await query

    // Verificar se houve erro de rate limit (429 Too Many Requests)
    if (status === 429) {
      console.error("Erro de limite de taxa (429 Too Many Requests)")
      return NextResponse.json(
        { error: "Muitas requisições. Por favor, tente novamente em alguns instantes." },
        { status: 429 },
      )
    }

    if (error) {
      console.error("Erro ao buscar turmas:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("Erro no servidor:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
