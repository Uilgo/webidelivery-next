import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Dashboard do estabelecimento
 * Página principal após login e onboarding
 */
export default async function DashboardPage() {
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
		.select("onboarding, nome, sobrenome, cargo")
		.eq("id", user.id)
		.single();

	// Se onboarding não foi completado, redireciona para onboarding
	if (!perfil?.onboarding) {
		redirect("/onboarding");
	}

	return (
		<div className="min-h-screen bg-muted/30 p-6">
			<div className="mx-auto max-w-7xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">
						Bem-vindo de volta, {perfil.nome} {perfil.sobrenome}!
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{/* Card de Boas-vindas */}
					<div className="rounded-lg border bg-card p-6">
						<h2 className="text-xl font-semibold mb-2">🎉 Parabéns!</h2>
						<p className="text-muted-foreground">
							Sua conta foi criada com sucesso. Você está logado como{" "}
							<span className="font-medium capitalize">{perfil.cargo}</span>.
						</p>
					</div>

					{/* Card de Status */}
					<div className="rounded-lg border bg-card p-6">
						<h2 className="text-xl font-semibold mb-2">📊 Status</h2>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span>Usuário:</span>
								<span className="font-medium">{user.email}</span>
							</div>
							<div className="flex justify-between">
								<span>Cargo:</span>
								<span className="font-medium capitalize">{perfil.cargo}</span>
							</div>
							<div className="flex justify-between">
								<span>Onboarding:</span>
								<span className="font-medium text-green-600">✅ Completo</span>
							</div>
						</div>
					</div>

					{/* Card de Próximos Passos */}
					<div className="rounded-lg border bg-card p-6">
						<h2 className="text-xl font-semibold mb-2">🚀 Próximos Passos</h2>
						<ul className="space-y-1 text-sm text-muted-foreground">
							<li>• Configurar estabelecimento</li>
							<li>• Criar cardápio</li>
							<li>• Configurar métodos de pagamento</li>
							<li>• Personalizar tema</li>
						</ul>
					</div>
				</div>

				{/* Botão de Logout */}
				<div className="mt-8">
					<form action="/api/auth/signout" method="POST">
						<button
							type="submit"
							className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							Sair
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
