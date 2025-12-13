import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Motor de atualização de sessão do Supabase no proxy
 * Responsável apenas por renovar tokens e gerenciar cookies de autenticação
 */
export async function updateSession(request: NextRequest) {
	// Cria resposta base que será modificada com novos cookies
	let supabaseResponse = NextResponse.next({
		request,
	});

	// Cliente Supabase configurado para trabalhar com cookies do proxy
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
		{
			cookies: {
				// Lê cookies da requisição atual
				getAll() {
					return request.cookies.getAll();
				},
				// Atualiza cookies na requisição e resposta
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => {
						request.cookies.set(name, value);
					});
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) => {
						supabaseResponse.cookies.set(name, value, options);
					});
				},
			},
		},
	);

	// IMPORTANTE: Sempre use getUser() ao invés de getSession() para validar tokens
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Retorna a resposta com a sessão atualizada e o usuário
	return { response: supabaseResponse, user };
}
