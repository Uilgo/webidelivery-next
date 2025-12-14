import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

/**
 * Proxy de autenticação e proteção de rotas (Next.js 16)
 * Implementa regras de redirecionamento conforme PRD:
 *
 * REGRAS DE REDIRECIONAMENTO:
 * - Rota raiz (/) → /admin/dashboard se autenticado ou /login se não
 * - Após login → /onboarding se onboarding=false, senão /admin/dashboard
 * - Ao concluir onboarding → setar onboarding=true e ir para /admin/dashboard
 * - Usuários logados não acessam /login, /signup → redirecionam para /
 */
export async function proxy(request: NextRequest) {
	// Chama o "Motor" para atualizar a sessão do Supabase
	const { response, user } = await updateSession(request);

	const pathname = request.nextUrl.pathname;

	// Define rotas conforme PRD
	const protectedRoutes = ["/admin", "/onboarding"];
	const authRoutes = ["/login", "/signup", "/forgot-password"];

	// Verifica tipos de rota
	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	// 1. ROTAS PROTEGIDAS: Requer autenticação
	if (isProtectedRoute && !user) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/login";
		redirectUrl.searchParams.set("redirectedFrom", pathname);
		return NextResponse.redirect(redirectUrl);
	}

	// 2. ROTAS DE AUTH: Usuários logados não devem acessar (conforme PRD)
	if (isAuthRoute && user) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/"; // Página raiz fará a lógica de onboarding
		return NextResponse.redirect(redirectUrl);
	}

	// 3. OUTRAS ROTAS: Permite acesso (APIs, assets, página raiz, etc.)
	return response;
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
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
