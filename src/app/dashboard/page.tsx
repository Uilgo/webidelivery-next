"use client";

import { signout } from "@/actions/auth";
import { useUser } from "@/hooks/core/useUser";

/**
 * Página principal do dashboard (área logada)
 * Exibe informações do usuário e cards de navegação
 */
export default function DashboardPage() {
	// Busca dados do usuário e perfil via hook
	const {
		user,
		perfil,
		isLoading,
		hasError,
		displayName,
		userRole,
		estabelecimento,
		isOnboardingComplete,
		hasEstabelecimento,
	} = useUser();

	// Estados de loading
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Carregando...</p>
				</div>
			</div>
		);
	}

	// Estados de erro
	if (hasError || !user) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 mb-4">Erro ao carregar dados do usuário</p>
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Tentar novamente
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">WebiDelivery Dashboard</h1>
							{estabelecimento && (
								<p className="text-sm text-gray-600 mt-1">{estabelecimento.nome}</p>
							)}
						</div>
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
					{/* Informações do usuário */}
					<div className="bg-white overflow-hidden shadow rounded-lg mb-6">
						<div className="px-4 py-5 sm:p-6">
							<h2 className="text-lg font-medium text-gray-900 mb-4">Bem-vindo, {displayName}!</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
								<div className="bg-blue-50 p-4 rounded-lg">
									<p className="text-sm text-blue-600 font-medium">Email</p>
									<p className="text-blue-900">{user.email}</p>
								</div>
								<div className="bg-green-50 p-4 rounded-lg">
									<p className="text-sm text-green-600 font-medium">Cargo</p>
									<p className="text-green-900 capitalize">{userRole}</p>
								</div>
								<div className="bg-purple-50 p-4 rounded-lg">
									<p className="text-sm text-purple-600 font-medium">Onboarding</p>
									<p className="text-purple-900">
										{isOnboardingComplete ? "✅ Completo" : "⏳ Pendente"}
									</p>
								</div>
								<div className="bg-orange-50 p-4 rounded-lg">
									<p className="text-sm text-orange-600 font-medium">Estabelecimento</p>
									<p className="text-orange-900">
										{hasEstabelecimento ? "✅ Vinculado" : "❌ Não vinculado"}
									</p>
								</div>
							</div>

							{/* Debug info - remover em produção */}
							<details className="mt-4">
								<summary className="text-sm text-gray-500 cursor-pointer">
									Debug Info (remover em produção)
								</summary>
								<pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
									{JSON.stringify({ perfil, estabelecimento }, null, 2)}
								</pre>
							</details>
						</div>
					</div>

					{/* Cards de navegação */}
					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="px-4 py-5 sm:p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">Acesso Rápido</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="bg-blue-50 p-4 rounded-lg">
									<h4 className="font-semibold text-blue-900">Pedidos</h4>
									<p className="text-blue-700">Gerencie seus pedidos</p>
								</div>
								<div className="bg-green-50 p-4 rounded-lg">
									<h4 className="font-semibold text-green-900">Cardápio</h4>
									<p className="text-green-700">Configure seu cardápio</p>
								</div>
								<div className="bg-purple-50 p-4 rounded-lg">
									<h4 className="font-semibold text-purple-900">Relatórios</h4>
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
