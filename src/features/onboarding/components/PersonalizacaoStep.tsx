"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { InputWithValidation } from "@/components/ui/input-with-validation";
import type { PersonalizacaoStepProps } from "../types/step-props";

/**
 * Step 3: Personalização
 * URL personalizada (slug) e logo
 * Agora usa props globais do OnboardingForm
 */
export function PersonalizacaoStep({
	register,
	errors,
	isLoading,
	isValid,
	slug,
	slugValidation,
	onNext,
	onPrev,
}: PersonalizacaoStepProps) {
	// IDs únicos para acessibilidade
	const slugId = useId();
	const logoId = useId();

	const { showSuccess, showError, showLoading, errorMessage, validateOnBlur } = slugValidation;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isValid) {
			onNext();
		}
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Personalização</h2>
				<p className="text-muted-foreground">
					Defina sua URL personalizada para o cardápio digital
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* URL Personalizada com validação dupla (Zod + Server) */}
				<Field>
					<FieldLabel htmlFor={slugId}>URL Personalizada *</FieldLabel>
					<FieldContent>
						<div className="space-y-2">
							<div className="flex items-center">
								<span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
									webidelivery.com.br/
								</span>
								<InputWithValidation
									{...register("slug", {
										onBlur: validateOnBlur,
									})}
									id={slugId}
									type="text"
									placeholder="minha-empresa"
									className="rounded-l-none"
									disabled={isLoading}
									showSuccess={showSuccess && !errors.slug}
									showError={showError || !!errors.slug}
									showLoading={showLoading}
									aria-invalid={showError || !!errors.slug}
								/>
							</div>

							<FieldError>
								{/* Priorizar erro do Zod (formato) sobre erro do servidor (disponibilidade) */}
								{errors.slug?.message || errorMessage}
							</FieldError>
						</div>
					</FieldContent>
				</Field>

				{/* Preview da URL */}
				{slug && (
					<div className="rounded-lg border bg-muted/50 p-4">
						<p className="text-sm font-medium">Preview da sua URL:</p>
						<p className="text-sm text-muted-foreground break-all">
							https://webidelivery.com.br/{slug}
						</p>
					</div>
				)}

				{/* Logo (futuro) */}
				<Field>
					<FieldLabel htmlFor={logoId}>Logo (opcional)</FieldLabel>
					<FieldContent>
						<div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
							<p className="text-sm text-muted-foreground">
								Upload de logo será implementado em breve
							</p>
						</div>
					</FieldContent>
				</Field>

				{/* Botões de Navegação */}
				<div className="flex justify-between pt-4">
					<Button type="button" variant="outline" onClick={onPrev} disabled={isLoading}>
						Voltar
					</Button>
					<Button type="submit" disabled={isLoading || !isValid} className="min-w-[120px]">
						{isLoading ? "Salvando..." : "Continuar"}
					</Button>
				</div>
			</form>
		</div>
	);
}
