"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/**
 * Formulário de recuperação de senha
 * Implementa fluxo conforme especificado no PRD
 */
export function ForgotForm() {
	const emailId = useId();
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [errors, setErrors] = useState<{
		email?: string;
		general?: string;
	}>({});

	/**
	 * Valida campo de email
	 */
	const validateForm = (formData: FormData): boolean => {
		const email = (formData.get("email") as string)?.trim();
		const newErrors: typeof errors = {};

		// Validação de email
		if (!email) {
			newErrors.email = "E-mail é obrigatório";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "E-mail inválido";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	/**
	 * Manipula submissão do formulário
	 */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setErrors({});

		const formData = new FormData(event.currentTarget);

		// Validar formulário
		if (!validateForm(formData)) {
			setIsLoading(false);
			return;
		}

		try {
			const email = (formData.get("email") as string)?.trim().toLowerCase();

			// TODO: Implementar Server Action para reset de senha
			// Por enquanto, simular sucesso
			await new Promise((resolve) => setTimeout(resolve, 2000));

			console.log("Solicitação de reset enviada para:", email);
			setIsSuccess(true);
		} catch (error) {
			console.error("Erro ao solicitar reset:", error);
			setErrors({
				general: "Erro ao enviar instruções. Tente novamente.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Tela de sucesso
	if (isSuccess) {
		return (
			<div className="w-full max-w-md space-y-8">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-bold text-primary">E-mail Enviado!</CardTitle>
						<CardDescription>
							Enviamos um e-mail com instruções para redefinir sua senha.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<div className="space-y-6">
							{/* Ícone de sucesso */}
							<div className="flex justify-center">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
									<Check className="h-8 w-8 text-primary" />
								</div>
							</div>

							{/* Instruções */}
							<div className="text-center text-sm text-muted-foreground">
								<p>Verifique sua caixa de entrada e siga as instruções no e-mail.</p>
								<p className="mt-2">Não recebeu? Verifique a pasta de spam ou tente novamente.</p>
							</div>

							{/* Link para voltar ao login */}
							<div className="text-center">
								<Link
									href="/login"
									className="text-sm font-medium text-primary hover:text-primary/80 hover:underline"
								>
									Voltar ao login
								</Link>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Formulário de solicitação
	return (
		<div className="w-full max-w-md space-y-8">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Esqueci minha senha</CardTitle>
					<CardDescription>
						Digite seu e-mail para receber instruções de recuperação
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
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

						{/* Botão de Submit */}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Enviando..." : "Enviar instruções"}
						</Button>

						{/* Link para voltar ao login */}
						<div className="text-center">
							<Link
								href="/login"
								className="text-sm text-primary hover:text-primary/80 hover:underline"
							>
								Voltar ao login
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
