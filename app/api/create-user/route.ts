import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    // Criar um cliente Supabase com permissões de serviço
    const supabase = createRouteHandlerClient({ cookies })

    // Usar a chave de serviço para criar o usuário (isso ignora as restrições de cadastro por email)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Importante: confirma o email automaticamente
      user_metadata: {
        full_name: fullName,
      },
    })

    if (error) {
      console.error("Erro ao criar usuário:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("Erro no servidor:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
