"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type LoginFormData, loginSchema } from "@/shared/schemas/auth";

/**
 * Formulário de login para estabelecimentos
 * Implementa validação com React Hook Form + Zod e integração com Server Actions
 */
export function LoginForm() {
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	// IDs únicos para acessibilidade
	const emailId = useId();
	const passwordId = useId();

	// Configuração do React Hook Form com Zod
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur", // Valida quando o campo perde o foco
	});

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

			setServerError(errorMessages[error] || "Erro desconhecido. Tente novamente");
		}
	}, [searchParams]);

	/**
	 * Manipula submissão do formulário
	 */
	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true);
		setServerError(null);

		try {
			// Criar FormData para Server Action
			const formData = new FormData();
			formData.append("email", data.email);
			formData.append("password", data.password);

			// Chamar Server Action
			await login(formData);
		} catch (error) {
			console.error("Erro no login:", error);
			setServerError("Erro inesperado. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
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
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Erro do servidor */}
						{serverError && (
							<div className="rounded-md bg-red-50 p-4">
								<div className="text-sm text-red-700">{serverError}</div>
							</div>
						)}

						{/* Campo E-mail */}
						<Field>
							<FieldLabel htmlFor={emailId}>E-mail</FieldLabel>
							<FieldContent>
								<Input
									id={emailId}
									type="email"
									autoComplete="email"
									placeholder="seu@email.com"
									disabled={isLoading}
									aria-invalid={!!errors.email}
									{...register("email")}
								/>
								<FieldError>{errors.email?.message}</FieldError>
							</FieldContent>
						</Field>

						{/* Campo Senha */}
						<Field>
							<FieldLabel htmlFor={passwordId}>Senha</FieldLabel>
							<FieldContent>
								<Input
									id={passwordId}
									type="password"
									autoComplete="current-password"
									placeholder="Digite sua senha"
									disabled={isLoading}
									aria-invalid={!!errors.password}
									{...register("password")}
								/>
								<FieldError>{errors.password?.message}</FieldError>
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
