import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Página de onboarding - configuração inicial do estabelecimento
 * Temporária até implementação completa conforme PRD
 */
export default async function OnboardingPage() {
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
		<div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
			<div className="w-full max-w-2xl space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Bem-vindo ao WebiDelivery!</h1>
					<p className="mt-2 text-muted-foreground">
						Olá {perfil?.nome}, vamos configurar seu estabelecimento
					</p>
				</div>

				<div className="rounded-lg border bg-card p-8 text-center">
					<h2 className="text-xl font-semibold mb-4">Página em Desenvolvimento</h2>
					<p className="text-muted-foreground mb-6">
						A página de onboarding está sendo desenvolvida conforme especificações do PRD.
					</p>
					<p className="text-sm text-muted-foreground">
						Por enquanto, você pode acessar o dashboard diretamente.
					</p>

					{/* Botão temporário para pular onboarding */}
					<form action="/api/skip-onboarding" method="POST" className="mt-6">
						<button
							type="submit"
							className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
						>
							Pular Onboarding (Temporário)
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
