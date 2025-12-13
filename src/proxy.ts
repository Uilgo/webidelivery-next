import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

/**
 * Proxy de autenticação e proteção de rotas (Next.js 16)
 * Atualiza sessão do usuário e aplica regras de redirecionamento
 */
export async function proxy(request: NextRequest) {
	// Chama o "Motor" para atualizar a sessão do Supabase
	const { response, user } = await updateSession(request);

	// Define quais rotas precisam de autenticação
	const protectedRoutes = ["/dashboard", "/profile", "/admin"];
	const publicRoutes = ["/login", "/signup"];

	// Verifica se a rota atual é protegida ou pública
	const isProtectedRoute = protectedRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route),
	);

	const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

	// Redireciona para login se tentar acessar rota protegida sem estar logado
	if (isProtectedRoute && !user) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/login";
		redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
		return NextResponse.redirect(redirectUrl);
	}

	// Redireciona para dashboard se tentar acessar rota pública estando logado
	if (isPublicRoute && user) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/dashboard";
		return NextResponse.redirect(redirectUrl);
	}

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
