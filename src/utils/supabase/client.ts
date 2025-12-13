import { createBrowserClient } from "@supabase/ssr";

/**
 * Cria cliente Supabase para uso no navegador (Client Components)
 * Usado em componentes que precisam de interatividade no cliente
 */
export function createClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
	);
}
