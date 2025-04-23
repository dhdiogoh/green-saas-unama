import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Criando um cliente Supabase específico para o middleware
  const res = NextResponse.next()
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
    const redirectUrl = new URL("/", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Se o usuário estiver autenticado e tentar acessar a página de login, redirecionar para o dashboard
  if (session && req.nextUrl.pathname === "/") {
    const redirectUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Configurar quais rotas o middleware deve ser executado
export const config = {
  matcher: ["/", "/dashboard/:path*"],
}
