"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputWithValidation } from "@/components/ui/input-with-validation";
import { useEmailValidation } from "@/hooks/form/useEmailValidation";
import { normalizeEmail } from "@/lib/formatters/text";
import { type SignupFormData, signupSchema } from "@/shared/schemas/auth";

/**
 * Formulário de cadastro para estabelecimentos
 * Implementa validação com React Hook Form + Zod conforme PRD
 */
export function SignupForm() {
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	// Hook para validação de email em tempo real
	const {
		email,
		handleEmailChange,
		validateOnBlur,
		showSuccess: emailSuccess,
		showError: emailError,
		showLoading: emailLoading,
		error: emailErrorMessage,
	} = useEmailValidation();

	// IDs únicos para acessibilidade
	const nomeId = useId();
	const sobrenomeId = useId();
	const emailId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();

	// Configuração do React Hook Form com Zod
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		mode: "onBlur", // Valida quando o campo perde o foco
	});

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

			setServerError(errorMessages[error] || "Erro desconhecido. Tente novamente");
		}
	}, [searchParams]);

	/**
	 * Manipula submissão do formulário
	 */
	const onSubmit = async (data: SignupFormData) => {
		// Verificar se email está disponível antes de submeter
		if (!emailSuccess) {
			setServerError("Verifique se o email está disponível antes de continuar");
			return;
		}

		setIsLoading(true);
		setServerError(null);

		try {
			// Criar FormData para Server Action
			const formData = new FormData();
			formData.append("nome", data.nome);
			formData.append("sobrenome", data.sobrenome);
			formData.append("email", normalizeEmail(email)); // Normalizar email antes de enviar
			formData.append("password", data.password);

			// Chamar Server Action
			await signup(formData);
		} catch (error) {
			console.error("Erro no cadastro:", error);
			setServerError("Erro inesperado. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md space-y-8">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
					<CardDescription>Cadastre-se para começar a usar o WebiDelivery</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} action={signup} className="space-y-6">
						{/* Erro do servidor */}
						{serverError && (
							<div className="rounded-md bg-red-50 p-4">
								<div className="text-sm text-red-700">{serverError}</div>
							</div>
						)}

						{/* Campos Nome e Sobrenome na mesma linha */}
						<div className="grid grid-cols-2 gap-4">
							<Field>
								<FieldLabel htmlFor={nomeId}>Nome</FieldLabel>
								<FieldContent>
									<Input
										{...register("nome")}
										id={nomeId}
										type="text"
										autoComplete="given-name"
										placeholder="Seu nome"
										disabled={isLoading}
										aria-invalid={!!errors.nome}
									/>
									<FieldError>{errors.nome?.message}</FieldError>
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel htmlFor={sobrenomeId}>Sobrenome</FieldLabel>
								<FieldContent>
									<Input
										{...register("sobrenome")}
										id={sobrenomeId}
										type="text"
										autoComplete="family-name"
										placeholder="Seu sobrenome"
										disabled={isLoading}
										aria-invalid={!!errors.sobrenome}
									/>
									<FieldError>{errors.sobrenome?.message}</FieldError>
								</FieldContent>
							</Field>
						</div>

						{/* Campo E-mail com validação dupla (Zod + Server) */}
						<Field>
							<FieldLabel htmlFor={emailId}>E-mail</FieldLabel>
							<FieldContent>
								<InputWithValidation
									{...register("email", {
										onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
											handleEmailChange(e.target.value);
										},
										onBlur: validateOnBlur,
									})}
									id={emailId}
									type="email"
									autoComplete="email"
									placeholder="seu@email.com"
									disabled={isLoading}
									showSuccess={emailSuccess && !errors.email}
									showError={emailError || !!errors.email}
									showLoading={emailLoading}
									aria-invalid={emailError || !!errors.email}
								/>
								<FieldError>
									{/* Priorizar erro do Zod (formato) sobre erro do servidor (disponibilidade) */}
									{errors.email?.message || emailErrorMessage}
								</FieldError>
							</FieldContent>
						</Field>

						{/* Campo Senha */}
						<Field>
							<FieldLabel htmlFor={passwordId}>Senha</FieldLabel>
							<FieldContent>
								<Input
									{...register("password")}
									id={passwordId}
									type="password"
									autoComplete="new-password"
									placeholder="Crie uma senha segura"
									disabled={isLoading}
									aria-invalid={!!errors.password}
								/>
								<FieldError>{errors.password?.message}</FieldError>
							</FieldContent>
						</Field>

						{/* Campo Confirmar Senha */}
						<Field>
							<FieldLabel htmlFor={confirmPasswordId}>Confirmar Senha</FieldLabel>
							<FieldContent>
								<Input
									{...register("confirmPassword")}
									id={confirmPasswordId}
									type="password"
									autoComplete="new-password"
									placeholder="Digite a senha novamente"
									disabled={isLoading}
									aria-invalid={!!errors.confirmPassword}
								/>
								<FieldError>{errors.confirmPassword?.message}</FieldError>
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
