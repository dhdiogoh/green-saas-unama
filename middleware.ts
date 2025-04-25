import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Criar resposta padrão
  const res = NextResponse.next()

  try {
    // Verificar se estamos em modo de demonstração
    const hasDemoUser = req.cookies.has("demo-user") || req.headers.get("x-demo-mode") === "true"

    if (hasDemoUser) {
      console.log("Middleware: Modo de demonstração detectado")
      // Em modo de demonstração, permitir acesso a todas as rotas
      return res
    }

    // Tentar criar cliente Supabase com tratamento de erro
    let supabase
    try {
      supabase = createMiddlewareClient({ req, res })
    } catch (supabaseError) {
      console.error("Erro ao criar cliente Supabase no middleware:", supabaseError)
      // Se não conseguir criar o cliente, permitir acesso (fallback)
      return res
    }

    // Verificar sessão com tratamento de erro
    let session = null
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Erro ao obter sessão no middleware:", error)
      } else {
        session = data.session
      }
    } catch (sessionError) {
      console.error("Exceção ao obter sessão no middleware:", sessionError)
      // Se houver erro ao obter sessão, permitir acesso (fallback)
      return res
    }

    // Rotas protegidas que requerem autenticação
    const protectedRoutes = ["/dashboard"]
    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // Se for uma rota protegida e o usuário não estiver autenticado, redirecionar para login
    if (isProtectedRoute && !session) {
      console.log("Middleware: Usuário não autenticado tentando acessar rota protegida")
      const redirectUrl = new URL("/", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Adicionar cookie para debug
    res.cookies.set("middleware-executed", "true")

    return res
  } catch (error) {
    console.error("Erro geral no middleware:", error)
    // Em caso de erro, permitir o acesso (modo de fallback)
    return res
  }
}

// Configurar quais rotas o middleware deve ser executado
export const config = {
  matcher: ["/", "/dashboard/:path*"],
}
