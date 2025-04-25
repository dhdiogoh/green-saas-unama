import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Criar resposta padrão
  const res = NextResponse.next()

  try {
    // Verificar se há um usuário demo no localStorage via cookie
    const hasDemoUserCookie = req.cookies.has("demo-user")

    // Verificar se estamos em uma rota protegida
    const protectedRoutes = ["/dashboard"]
    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // Se for uma rota protegida e não houver usuário demo, redirecionar para login
    if (isProtectedRoute && !hasDemoUserCookie) {
      console.log("Middleware: Usuário não autenticado tentando acessar rota protegida")
      const redirectUrl = new URL("/", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Verificar se o usuário está tentando acessar o dashboard de aluno, mas não é aluno
    if (req.nextUrl.pathname.startsWith("/dashboard/aluno") && hasDemoUserCookie) {
      // Tentar obter o tipo de usuário do cookie
      const cookieValue = req.cookies.get("user-type")?.value
      if (cookieValue && cookieValue !== "aluno") {
        console.log("Middleware: Usuário não-aluno tentando acessar dashboard de aluno")
        const redirectUrl = new URL("/dashboard", req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Verificar se o usuário está tentando acessar o dashboard principal, mas é aluno
    if (req.nextUrl.pathname === "/dashboard" && hasDemoUserCookie) {
      // Tentar obter o tipo de usuário do cookie
      const cookieValue = req.cookies.get("user-type")?.value
      if (cookieValue && cookieValue === "aluno") {
        console.log("Middleware: Aluno tentando acessar dashboard principal")
        const redirectUrl = new URL("/dashboard/aluno", req.url)
        return NextResponse.redirect(redirectUrl)
      }
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
  matcher: ["/", "/dashboard/:path*"],
}
