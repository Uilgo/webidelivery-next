"use client";

import { useId } from "react";
import { login, signup } from "@/actions/auth";

/**
 * Página de login e cadastro
 * Formulário único que permite tanto login quanto criação de conta
 */
export default function LoginPage() {
	// Gera IDs únicos para acessibilidade dos campos
	const emailId = useId();
	const passwordId = useId();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold mb-6 text-center text-gray-900">WebiDelivery</h1>

				<form className="space-y-4">
					<div>
						<label htmlFor={emailId} className="block text-sm font-medium text-gray-700 mb-1">
							Email:
						</label>
						<input
							id={emailId}
							name="email"
							type="email"
							required
							className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="seu@email.com"
						/>
					</div>

					<div>
						<label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 mb-1">
							Senha:
						</label>
						<input
							id={passwordId}
							name="password"
							type="password"
							required
							className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="••••••••"
						/>
					</div>

					<div className="space-y-2">
						<button
							type="submit"
							formAction={login}
							className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							Entrar
						</button>
						<button
							type="submit"
							formAction={signup}
							className="w-full p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
						>
							Cadastrar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
