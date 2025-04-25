import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Criando um cliente Supabase específico para o middleware
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    // Verificando se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Rotas protegidas que requerem autenticação
    const protectedRoutes = ["/dashboard"]

    // Verificar se a rota atual é protegida
    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // Se for uma rota protegida e o usuário não estiver autenticado, redirecionar para login
    if (isProtectedRoute && !session) {
      console.log("Middleware: Usuário não autenticado tentando acessar rota protegida")

      // Verificar se estamos em modo de demonstração (verificando um cookie ou header)
      const hasDemoUser = req.cookies.has("demo-user") || req.headers.get("x-demo-mode") === "true"

      if (hasDemoUser) {
        // Em modo de demonstração, permitir acesso
        return res
      }

      const redirectUrl = new URL("/", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Se o usuário estiver autenticado e tentar acessar a página de login, redirecionar para o dashboard apropriado
    if (session && req.nextUrl.pathname === "/") {
      console.log("Middleware: Usuário autenticado tentando acessar página de login")

      // Verificar o tipo de usuário
      const userType = session.user.user_metadata?.tipo_usuario || session.user.user_metadata?.user_type

      // Redirecionar com base no tipo de usuário
      const redirectUrl = new URL(userType === "aluno" ? "/dashboard/aluno" : "/dashboard", req.url)

      return NextResponse.redirect(redirectUrl)
    }

    // Verificar permissões para rotas específicas
    if (session) {
      const userType = session.user.user_metadata?.tipo_usuario || session.user.user_metadata?.user_type

      // Alunos não podem acessar rotas de admin
      if (
        userType === "aluno" &&
        ((req.nextUrl.pathname.startsWith("/dashboard") && !req.nextUrl.pathname.startsWith("/dashboard/aluno")) ||
          req.nextUrl.pathname === "/dashboard/nova-entrega")
      ) {
        const redirectUrl = new URL("/dashboard/aluno", req.url)
        return NextResponse.redirect(redirectUrl)
      }

      // Admins não podem acessar rotas de alunos
      if (userType !== "aluno" && req.nextUrl.pathname.startsWith("/dashboard/aluno")) {
        const redirectUrl = new URL("/dashboard", req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  } catch (error) {
    console.error("Erro no middleware:", error)

    // Em caso de erro, permitir o acesso (modo de fallback)
    return res
  }

  return res
}

// Configurar quais rotas o middleware deve ser executado
export const config = {
  matcher: ["/", "/dashboard/:path*"],
}
