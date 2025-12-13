import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Página raiz - funciona como redirecionador inteligente
 * Implementa regras de redirecionamento conforme PRD
 */
export default async function Home() {
	const supabase = await createClient();

	// Verifica se usuário está autenticado
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Se não estiver logado, redireciona para login
	if (!user) {
		redirect("/login");
	}

	// Se estiver logado, buscar dados do perfil para verificar onboarding
	const { data: perfil } = await supabase
		.from("perfis")
		.select("onboarding")
		.eq("id", user.id)
		.single();

	// Se onboarding não foi completado, redireciona para onboarding
	if (!perfil?.onboarding) {
		redirect("/onboarding");
	}

	// Se onboarding foi completado, redireciona para dashboard
	redirect("/admin/dashboard");
}
