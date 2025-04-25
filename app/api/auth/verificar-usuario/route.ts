import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Extrair dados da requisição com tratamento de erro
    let requestData
    try {
      requestData = await request.json()
    } catch (parseError) {
      console.error("Erro ao analisar JSON da requisição:", parseError)
      return NextResponse.json(
        {
          autorizado: false,
          mensagem: "Formato de requisição inválido",
        },
        { status: 400 },
      )
    }

    const { email, tipo_usuario, instituicao } = requestData

    if (!email || !tipo_usuario || !instituicao) {
      return NextResponse.json(
        {
          autorizado: false,
          mensagem: "Email, tipo de usuário e instituição são obrigatórios",
        },
        { status: 400 },
      )
    }

    // Modo de demonstração - aceitar emails específicos sem verificar no Supabase
    if (
      (email === "cienciaalcindob@gmail.com" && tipo_usuario === "aluno" && instituicao === "Unama Alcindo Cacela") ||
      (email === "adminalcindo@gmail.com" && tipo_usuario === "instituicao" && instituicao === "Unama Alcindo Cacela")
    ) {
      return NextResponse.json(
        {
          autorizado: true,
          dados: {
            tipo_usuario,
            instituicao,
            ...(tipo_usuario === "aluno" ? { curso: "Ciência da Computação", turma: "Turma B" } : {}),
          },
        },
        { status: 200 },
      )
    }

    // Criar cliente Supabase com tratamento de erro
    let supabase
    try {
      supabase = createRouteHandlerClient({ cookies })
    } catch (supabaseError) {
      console.error("Erro ao criar cliente Supabase:", supabaseError)
      return NextResponse.json(
        {
          autorizado: false,
          mensagem: "Erro interno do servidor ao conectar com o banco de dados",
        },
        { status: 500 },
      )
    }

    // Verificar se o usuário está autorizado
    try {
      const { data, error } = await supabase
        .from("usuarios_permitidos")
        .select("*")
        .eq("email", email)
        .eq("ativo", true)
        .maybeSingle()

      if (error) {
        console.error("Erro ao verificar usuário:", error)
        return NextResponse.json(
          { autorizado: false, mensagem: "Erro ao verificar usuário no banco de dados" },
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
    } catch (dbError) {
      console.error("Erro ao consultar banco de dados:", dbError)
      return NextResponse.json(
        {
          autorizado: false,
          mensagem: "Erro interno do servidor ao verificar usuário",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Erro geral no servidor:", error)
    return NextResponse.json(
      {
        autorizado: false,
        mensagem: error.message || "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
