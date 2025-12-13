import { signout } from "@/actions/auth";
import { createClient } from "@/utils/supabase/server";

/**
 * Página principal do dashboard (área logada)
 * Exibe informações do usuário e cards de navegação
 */
export default async function DashboardPage() {
	// Busca dados do usuário no servidor
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Fallback caso não esteja autenticado (não deveria acontecer devido ao proxy)
	if (!user) {
		return <div>Não autenticado</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<h1 className="text-3xl font-bold text-gray-900">WebiDelivery Dashboard</h1>
						<form action={signout}>
							<button
								type="submit"
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
							>
								Logout
							</button>
						</form>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="px-4 py-5 sm:p-6">
							<h2 className="text-lg font-medium text-gray-900 mb-4">Bem-vindo ao Dashboard!</h2>
							<p className="text-gray-600 mb-4">
								Usuário logado: <strong>{user.email}</strong>
							</p>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="bg-blue-50 p-4 rounded-lg">
									<h3 className="font-semibold text-blue-900">Pedidos</h3>
									<p className="text-blue-700">Gerencie seus pedidos</p>
								</div>
								<div className="bg-green-50 p-4 rounded-lg">
									<h3 className="font-semibold text-green-900">Cardápio</h3>
									<p className="text-green-700">Configure seu cardápio</p>
								</div>
								<div className="bg-purple-50 p-4 rounded-lg">
									<h3 className="font-semibold text-purple-900">Relatórios</h3>
									<p className="text-purple-700">Veja suas estatísticas</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
