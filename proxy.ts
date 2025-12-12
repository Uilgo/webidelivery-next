import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/proxy'

// ⚠️ MUDANÇA: Função agora se chama "proxy" ao invés de "middleware"
export async function proxy(request: NextRequest) {
  // Chama o "Motor" para atualizar a sessão
  const { response, user } = await updateSession(request)

  // Define as rotas protegidas e públicas
  const protectedRoutes = ['/dashboard', '/profile', '/admin']
  const publicRoutes = ['/login', '/signup']

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Redireciona para login se acessar rota protegida sem estar logado
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redireciona para dashboard se acessar rota pública estando logado
  if (isPublicRoute && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match todos os caminhos exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico
     * - arquivos de imagem
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}