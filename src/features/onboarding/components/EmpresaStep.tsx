"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GlobalStepProps } from "../types/step-props";

interface EmpresaStepProps extends GlobalStepProps {
	onNext: () => void;
}

/**
 * Step 1: Dados básicos da empresa
 * Nome, descrição e WhatsApp
 * Agora usa props globais do OnboardingForm
 */
export function EmpresaStep({
	register,
	errors,
	isLoading,
	formatters,
	handleFieldChange,
	isValid,
	onNext,
}: EmpresaStepProps) {
	// IDs únicos para acessibilidade
	const nomeId = useId();
	const descricaoId = useId();
	const whatsappId = useId();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isValid) {
			onNext();
		}
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Dados da Empresa</h2>
				<p className="text-muted-foreground">
					Vamos começar com as informações básicas do seu estabelecimento
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Nome da Empresa */}
				<Field>
					<FieldLabel htmlFor={nomeId}>Nome da Empresa *</FieldLabel>
					<FieldContent>
						<Input
							{...register("nome")}
							id={nomeId}
							type="text"
							placeholder="Ex: Pizzaria do João"
							disabled={isLoading}
							aria-invalid={!!errors.nome}
						/>
						<FieldError>{errors.nome?.message}</FieldError>
					</FieldContent>
				</Field>

				{/* Descrição */}
				<Field>
					<FieldLabel htmlFor={descricaoId}>Descrição (opcional)</FieldLabel>
					<FieldContent>
						<Textarea
							{...register("descricao")}
							id={descricaoId}
							placeholder="Conte um pouco sobre seu estabelecimento..."
							rows={3}
							disabled={isLoading}
							aria-invalid={!!errors.descricao}
						/>
						<FieldError>{errors.descricao?.message}</FieldError>
					</FieldContent>
				</Field>

				{/* WhatsApp */}
				<Field>
					<FieldLabel htmlFor={whatsappId}>WhatsApp *</FieldLabel>
					<FieldContent>
						<Input
							{...register("whatsapp", {
								onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
									handleFieldChange("whatsapp", e.target.value, formatters.whatsapp);
								},
							})}
							id={whatsappId}
							type="tel"
							placeholder="(11) 99999-9999"
							maxLength={15}
							disabled={isLoading}
							aria-invalid={!!errors.whatsapp}
						/>
						<FieldError>{errors.whatsapp?.message}</FieldError>
					</FieldContent>
				</Field>

				{/* Botão Continuar */}
				<div className="flex justify-end pt-4">
					<Button type="submit" disabled={isLoading || !isValid} className="min-w-[120px]">
						{isLoading ? "Salvando..." : "Continuar"}
					</Button>
				</div>
			</form>
		</div>
	);
}
