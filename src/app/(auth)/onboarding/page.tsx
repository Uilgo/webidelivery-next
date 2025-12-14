import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingPage } from "@/features/onboarding/pages/OnboardingPage";
import { Auth } from "@/layouts/Auth";
import { createClient } from "@/utils/supabase/server";

// Loading fallback para Suspense (useSearchParams requer)
function OnboardingLoading() {
	return (
		<div className="h-svh flex items-center justify-center">
			<div className="animate-pulse text-muted-foreground">Carregando...</div>
		</div>
	);
}

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

	// Se não estiver logado, redireciona para login (conforme PRD)
	if (!user) {
		redirect("/login");
	}

	// Permite acesso direto ao onboarding mesmo se já completado
	// (para casos de re-configuração ou teste)
	// A lógica de redirecionamento fica apenas na página raiz (/)

	return (
		<Auth fullScreen>
			<Suspense fallback={<OnboardingLoading />}>
				<OnboardingPage />
			</Suspense>
		</Auth>
	);
}
