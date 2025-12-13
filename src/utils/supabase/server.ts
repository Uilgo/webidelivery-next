import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cria cliente Supabase para uso no servidor (Server Components, API Routes)
 * Gerencia cookies de autenticação automaticamente para manter sessão
 */
export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
		{
			cookies: {
				// Lê todos os cookies da requisição
				getAll() {
					return cookieStore.getAll();
				},
				// Define cookies na resposta para manter sessão
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch {
						// Chamado de um Server Component
						// Pode ser ignorado se você tem proxy refreshing sessions
					}
				},
			},
		},
	);
}
