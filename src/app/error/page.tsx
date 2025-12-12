export default function ErrorPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-red-600 mb-4">Erro</h1>
				<p className="text-gray-600 mb-6">Algo deu errado. Tente novamente mais tarde.</p>
				<a
					href="/login"
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
				>
					Voltar ao Login
				</a>
			</div>
		</div>
	);
}
