import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Página raiz - funciona como redirecionador inteligente
 * Direciona usuários logados para dashboard e não logados para login
 */
export default async function Home() {
	// Verifica se usuário está autenticado
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Se o usuário estiver logado, redireciona para o dashboard
	if (user) {
		redirect("/dashboard");
	}

	// Se não estiver logado, redireciona para o login
	redirect("/login");
}
