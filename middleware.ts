import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Criar resposta padrão
  const res = NextResponse.next()

  try {
    // Verificar se estamos em uma rota protegida
    const protectedRoutes = ["/dashboard"]
    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // Verificar se há um usuário demo no localStorage via cookie
    const hasDemoUserCookie = req.cookies.has("demo-user")

    // Se for uma rota protegida e não houver usuário demo, redirecionar para login
    if (isProtectedRoute && !hasDemoUserCookie) {
      console.log("Middleware: Usuário não autenticado tentando acessar rota protegida")
      const redirectUrl = new URL("/", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error("Erro geral no middleware:", error)
    // Em caso de erro, permitir o acesso (modo de fallback)
    return res
  }
}

// Configurar quais rotas o middleware deve ser executado
export const config = {
  matcher: ["/dashboard/:path*"],
}
