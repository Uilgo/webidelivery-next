import { redirect } from "next/navigation";
import { OnboardingPage } from "@/features/onboarding/pages/OnboardingPage";
import { Auth } from "@/layouts/Auth";
import { createClient } from "@/utils/supabase/server";

/**
 * Página de onboarding - configuração inicial do estabelecimento
 * Implementação completa conforme PRD
 */
export default async function Onboarding() {
	const supabase = await createClient();

	// Verifica se usuário está autenticado
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Se não estiver logado, redireciona para login
	if (!user) {
		redirect("/login");
	}

	// Buscar dados do perfil
	const { data: perfil } = await supabase
		.from("perfis")
		.select("onboarding, nome, sobrenome")
		.eq("id", user.id)
		.single();

	// Se onboarding já foi completado, redireciona para dashboard
	if (perfil?.onboarding) {
		redirect("/admin/dashboard");
	}

	return (
		<Auth>
			<OnboardingPage />
		</Auth>
	);
}
