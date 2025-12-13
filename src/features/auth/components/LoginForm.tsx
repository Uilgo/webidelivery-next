"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/**
 * Formulário de login para estabelecimentos
 * Implementa validação client-side e integração com Server Actions
 */
export function LoginForm() {
	const emailId = useId();
	const passwordId = useId();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		general?: string;
	}>({});

	// Verifica se há erro nos query parameters
	useEffect(() => {
		const error = searchParams.get("error");
		if (error) {
			const errorMessages: Record<string, string> = {
				"invalid-credentials": "E-mail ou senha incorretos",
				"missing-data": "Preencha todos os campos obrigatórios",
				"auth-error": "Erro na autenticação. Tente novamente",
				"no-user": "Erro interno. Tente novamente",
				unexpected: "Erro inesperado. Tente novamente",
			};

			setErrors({
				general: errorMessages[error] || "Erro desconhecido. Tente novamente",
			});
		}
	}, [searchParams]);

	/**
	 * Valida campos do formulário
	 */
	const validateForm = (formData: FormData): boolean => {
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const newErrors: typeof errors = {};

		// Validação de email
		if (!email) {
			newErrors.email = "E-mail é obrigatório";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "E-mail inválido";
		}

		// Validação de senha
		if (!password) {
			newErrors.password = "Senha é obrigatória";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	/**
	 * Manipula submissão do formulário com validação client-side
	 */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		const formData = new FormData(event.currentTarget);

		// Validar formulário no client-side
		if (!validateForm(formData)) {
			event.preventDefault();
			return;
		}

		// Se validação passou, deixar Server Action executar
		setIsLoading(true);
	};

	return (
		<div className="w-full max-w-md space-y-8">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">WebiDelivery</CardTitle>
					<CardDescription>
						Faça login em sua conta para acessar o painel de gerenciamento
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} action={login} className="space-y-6">
						{/* Erro geral */}
						{errors.general && (
							<div className="rounded-md bg-red-50 p-4">
								<div className="text-sm text-red-700">{errors.general}</div>
							</div>
						)}

						{/* Campo E-mail */}
						<Field>
							<FieldLabel htmlFor={emailId}>E-mail</FieldLabel>
							<FieldContent>
								<Input
									id={emailId}
									name="email"
									type="email"
									autoComplete="email"
									placeholder="seu@email.com"
									disabled={isLoading}
									aria-invalid={!!errors.email}
								/>
								<FieldError>{errors.email}</FieldError>
							</FieldContent>
						</Field>

						{/* Campo Senha */}
						<Field>
							<FieldLabel htmlFor={passwordId}>Senha</FieldLabel>
							<FieldContent>
								<Input
									id={passwordId}
									name="password"
									type="password"
									autoComplete="current-password"
									placeholder="Digite sua senha"
									disabled={isLoading}
									aria-invalid={!!errors.password}
								/>
								<FieldError>{errors.password}</FieldError>
							</FieldContent>
						</Field>

						{/* Botão de Submit */}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Entrando..." : "Entrar"}
						</Button>

						{/* Link Esqueci minha senha */}
						<div className="text-center">
							<Link
								href="/forgot-password"
								className="text-sm text-primary hover:text-primary/80 hover:underline"
							>
								Esqueci minha senha
							</Link>
						</div>

						{/* Link para Cadastro */}
						<div className="text-center">
							<span className="text-sm text-muted-foreground">Não tem conta? </span>
							<Link
								href="/signup"
								className="text-sm font-medium text-primary hover:text-primary/80 hover:underline"
							>
								Cadastre-se
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
