"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/**
 * Valida senha conforme regras do PRD:
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial
 */
/**
 * Valida senha conforme regras do PRD
 */
const validatePassword = (password: string): string | null => {
	if (password.length < 8) {
		return "Senha deve ter pelo menos 8 caracteres";
	}

	if (!/[a-zA-Z]/.test(password)) {
		return "Senha deve conter pelo menos 1 letra";
	}

	if (!/\d/.test(password)) {
		return "Senha deve conter pelo menos 1 número";
	}

	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		return "Senha deve conter pelo menos 1 caractere especial";
	}

	return null;
};

/**
 * Valida email
 */
const validateEmail = (email: string): string | null => {
	if (!email) {
		return "E-mail é obrigatório";
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return "E-mail inválido";
	}

	return null;
};

/**
 * Formulário de cadastro para estabelecimentos
 * Implementa validação rigorosa conforme PRD
 */
export function SignupForm() {
	const nomeId = useId();
	const sobrenomeId = useId();
	const emailId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{
		nome?: string;
		sobrenome?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
		general?: string;
	}>({});

	// Verifica se há erro nos query parameters
	useEffect(() => {
		const error = searchParams.get("error");
		if (error) {
			const errorMessages: Record<string, string> = {
				"email-exists": "Já existe uma conta com este e-mail. Faça login para continuar.",
				"weak-password":
					"Senha muito fraca. Use pelo menos 8 caracteres com letras, números e símbolos",
				"missing-data": "Preencha todos os campos obrigatórios",
				"auth-error": "Erro na criação da conta. Tente novamente",
				"no-user": "Erro interno. Tente novamente",
				unexpected: "Erro inesperado. Tente novamente",
			};

			setErrors({
				general: errorMessages[error] || "Erro desconhecido. Tente novamente",
			});
		}
	}, [searchParams]);

	/**
	 * Valida todos os campos do formulário
	 */
	const validateForm = (formData: FormData): boolean => {
		const nome = (formData.get("nome") as string)?.trim();
		const sobrenome = (formData.get("sobrenome") as string)?.trim();
		const email = (formData.get("email") as string)?.trim().toLowerCase();
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;
		const newErrors: typeof errors = {};

		// Validações básicas
		if (!nome) newErrors.nome = "Nome é obrigatório";
		if (!sobrenome) newErrors.sobrenome = "Sobrenome é obrigatório";

		// Validação de email
		const emailError = validateEmail(email);
		if (emailError) newErrors.email = emailError;

		// Validação de senha
		if (!password) {
			newErrors.password = "Senha é obrigatória";
		} else {
			const passwordError = validatePassword(password);
			if (passwordError) newErrors.password = passwordError;
		}

		// Validação de confirmação de senha
		if (!confirmPassword) {
			newErrors.confirmPassword = "Confirmação de senha é obrigatória";
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = "As senhas não coincidem";
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

		// Normalizar email para lowercase antes de enviar
		const email = (formData.get("email") as string)?.trim().toLowerCase();
		formData.set("email", email);

		// Se validação passou, deixar Server Action executar
		setIsLoading(true);
	};

	return (
		<div className="w-full max-w-md space-y-8">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
					<CardDescription>Cadastre-se para começar a usar o WebiDelivery</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} action={signup} className="space-y-6">
						{/* Erro geral */}
						{errors.general && (
							<div className="rounded-md bg-red-50 p-4">
								<div className="text-sm text-red-700">{errors.general}</div>
							</div>
						)}

						{/* Campos Nome e Sobrenome na mesma linha */}
						<div className="grid grid-cols-2 gap-4">
							<Field>
								<FieldLabel htmlFor={nomeId}>Nome</FieldLabel>
								<FieldContent>
									<Input
										id={nomeId}
										name="nome"
										type="text"
										autoComplete="given-name"
										placeholder="Seu nome"
										disabled={isLoading}
										aria-invalid={!!errors.nome}
									/>
									<FieldError>{errors.nome}</FieldError>
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel htmlFor={sobrenomeId}>Sobrenome</FieldLabel>
								<FieldContent>
									<Input
										id={sobrenomeId}
										name="sobrenome"
										type="text"
										autoComplete="family-name"
										placeholder="Seu sobrenome"
										disabled={isLoading}
										aria-invalid={!!errors.sobrenome}
									/>
									<FieldError>{errors.sobrenome}</FieldError>
								</FieldContent>
							</Field>
						</div>

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
									autoComplete="new-password"
									placeholder="Crie uma senha segura"
									disabled={isLoading}
									aria-invalid={!!errors.password}
								/>
								<FieldError>{errors.password}</FieldError>
							</FieldContent>
						</Field>

						{/* Campo Confirmar Senha */}
						<Field>
							<FieldLabel htmlFor={confirmPasswordId}>Confirmar Senha</FieldLabel>
							<FieldContent>
								<Input
									id={confirmPasswordId}
									name="confirmPassword"
									type="password"
									autoComplete="new-password"
									placeholder="Digite a senha novamente"
									disabled={isLoading}
									aria-invalid={!!errors.confirmPassword}
								/>
								<FieldError>{errors.confirmPassword}</FieldError>
							</FieldContent>
						</Field>

						{/* Botão de Submit */}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Criando conta..." : "Cadastrar"}
						</Button>

						{/* Link para Login */}
						<div className="text-center">
							<span className="text-sm text-muted-foreground">Já tem conta? </span>
							<Link
								href="/login"
								className="text-sm font-medium text-primary hover:text-primary/80 hover:underline"
							>
								Faça login
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
