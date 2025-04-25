import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Criar cliente Supabase
    const supabase = createRouteHandlerClient({ cookies })

    // Obter parâmetros da URL
    const { searchParams } = new URL(request.url)
    const curso = searchParams.get("curso")
    const unidade = searchParams.get("unidade")

    // Buscar dados da view rankingturmas
    let query = supabase.from("rankingturmas").select("*")

    if (curso && curso !== "todos") {
      query = query.eq("curso", curso)
    }

    if (unidade && unidade !== "todas") {
      query = query.eq("unidade", unidade)
    }

    // Ordenar por pontuação
    query = query.order("total_pontos", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar ranking:", error)

      // Se houver erro na view, buscar diretamente da tabela entregas
      const entregasQuery = supabase
        .from("entregas")
        .select("turma, curso, unidade, pontos_obtidos, quantidade")
        .in("status", ["aprovada", "pendente"])

      if (curso && curso !== "todos") {
        entregasQuery.eq("curso", curso)
      }

      if (unidade && unidade !== "todas") {
        entregasQuery.eq("unidade", unidade)
      }

      const { data: entregasData, error: entregasError } = await entregasQuery

      if (entregasError) {
        return NextResponse.json({ error: entregasError.message }, { status: 500 })
      }

      // Agrupar por turma, curso e unidade
      const rankingMap = {}

      entregasData.forEach((item) => {
        const key = `${item.turma}-${item.curso}-${item.unidade}`

        if (!rankingMap[key]) {
          rankingMap[key] = {
            turma: item.turma,
            curso: item.curso,
            unidade: item.unidade,
            total_entregas: 0,
            total_reciclado_kg: 0,
            total_pontos: 0,
          }
        }

        rankingMap[key].total_entregas += 1
        rankingMap[key].total_reciclado_kg += Number(item.quantidade)
        rankingMap[key].total_pontos += Number(item.pontos_obtidos)
      })

      // Converter para array e ordenar
      const rankingData = Object.values(rankingMap).sort((a, b) => b.total_pontos - a.total_pontos)

      return NextResponse.json({ data: rankingData }, { status: 200 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("Erro no servidor:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
