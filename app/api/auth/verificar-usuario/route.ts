import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, tipo_usuario, instituicao } = await request.json()

    if (!email || !tipo_usuario || !instituicao) {
      return NextResponse.json({ error: "Email, tipo de usuário e instituição são obrigatórios" }, { status: 400 })
    }

    // Criar cliente Supabase
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar se o usuário está autorizado
    const { data, error } = await supabase
      .from("usuarios_permitidos")
      .select("*")
      .eq("email", email)
      .eq("ativo", true)
      .maybeSingle() // Usar maybeSingle em vez de single para evitar erro quando não encontrar

    if (error) {
      console.error("Erro ao verificar usuário:", error)
      return NextResponse.json(
        { autorizado: false, mensagem: "Usuário não encontrado ou não autorizado" },
        { status: 200 },
      )
    }

    // Se não encontrou nenhum usuário
    if (!data) {
      return NextResponse.json(
        { autorizado: false, mensagem: "Usuário não encontrado ou não autorizado" },
        { status: 200 },
      )
    }

    // Verificar se o tipo de usuário e instituição correspondem
    if (data.tipo_usuario !== tipo_usuario) {
      return NextResponse.json(
        {
          autorizado: false,
          mensagem: `Este email está registrado como ${data.tipo_usuario}, não como ${tipo_usuario}`,
        },
        { status: 200 },
      )
    }

    if (data.instituicao !== instituicao) {
      return NextResponse.json(
        {
          autorizado: false,
          mensagem: `Este email está associado à instituição ${data.instituicao}, não à ${instituicao}`,
        },
        { status: 200 },
      )
    }

    // Se chegou até aqui, o usuário está autorizado
    return NextResponse.json(
      {
        autorizado: true,
        dados: {
          tipo_usuario: data.tipo_usuario,
          instituicao: data.instituicao,
          curso: data.curso,
          turma: data.turma,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Erro no servidor:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
