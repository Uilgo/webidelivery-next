"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { InputWithValidation } from "@/components/ui/input-with-validation";
import { PictureUpload } from "@/components/ui/picture-upload";
import type { PersonalizacaoStepProps } from "../types/step-props";

/**
 * Step 3: Personalização
 * URL personalizada (slug) e logo
 * Usa estado local para controle direto do input
 */
export function PersonalizacaoStep({
	errors,
	isLoading,
	isValid,
	slug,
	slugValidation,
	handleFieldChange,
	watch,
	onNext,
	onPrev,
}: PersonalizacaoStepProps) {
	// IDs únicos para acessibilidade
	const slugId = useId();
	const logoLightId = `logo-light-${useId()}`;
	const logoDarkId = `logo-dark-${useId()}`;

	// Estado local para controle direto do input do slug
	const [inputValue, setInputValue] = useState(slug || "");

	// Estado local para os logos (para reatividade imediata)
	const watchedLogoUrl = watch("logo_url");
	const watchedLogoUrlDark = watch("logo_url_dark");
	const [logoUrl, setLogoUrl] = useState(watchedLogoUrl || "");
	const [logoUrlDark, setLogoUrlDark] = useState(watchedLogoUrlDark || "");

	// Sincronizar com o slug do hook quando ele muda externamente
	useEffect(() => {
		if (slug !== inputValue) {
			setInputValue(slug);
		}
	}, [slug, inputValue]);

	// Sincronizar logos com o watch
	useEffect(() => {
		if (watchedLogoUrl !== undefined) {
			setLogoUrl(watchedLogoUrl || "");
		}
	}, [watchedLogoUrl]);

	useEffect(() => {
		if (watchedLogoUrlDark !== undefined) {
			setLogoUrlDark(watchedLogoUrlDark || "");
		}
	}, [watchedLogoUrlDark]);

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
					Defina o logo e URL personalizada para o cardápio digital
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Logos da Empresa - Light e Dark lado a lado */}
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
					{/* Logo Light (tema claro) */}
					<PictureUpload
						id={logoLightId}
						value={logoUrl}
						onChange={(value) => {
							setLogoUrl(value);
							handleFieldChange("logo_url", value);
						}}
						label="Logo Light (opcional)"
						hint="Para tema claro"
						error={errors.logo_url?.message}
						disabled={isLoading}
						maxSize={512}
						maxSizeKB={100}
						previewBg="light"
					/>

					{/* Logo Dark (tema escuro) */}
					<PictureUpload
						id={logoDarkId}
						value={logoUrlDark}
						onChange={(value) => {
							setLogoUrlDark(value);
							handleFieldChange("logo_url_dark", value);
						}}
						label="Logo Dark (opcional)"
						hint="Para tema escuro"
						error={errors.logo_url_dark?.message}
						disabled={isLoading}
						maxSize={512}
						maxSizeKB={100}
						previewBg="dark"
					/>
				</div>

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
									id={slugId}
									type="text"
									placeholder="minha-empresa"
									className="rounded-l-none"
									disabled={isLoading}
									showSuccess={showSuccess && !errors.slug}
									showError={showError || !!errors.slug}
									showLoading={showLoading}
									aria-invalid={showError || !!errors.slug}
									value={inputValue}
									onChange={(e) => {
										// Converter espaços para hífens em tempo real
										const rawValue = e.target.value;
										const convertedValue = rawValue.replace(/ /g, "-");

										// Atualizar estado local imediatamente
										setInputValue(convertedValue);

										// Atualizar o hook de validação
										slugValidation.handleSlugChange(convertedValue);
									}}
									onBlur={validateOnBlur}
								/>
							</div>

							{/* Mensagens de validação */}
							<div className="space-y-1">
								{/* Erro do Zod (formato) tem prioridade */}
								{errors.slug?.message && (
									<p className="text-sm text-destructive">{errors.slug.message}</p>
								)}

								{/* Erro do servidor (disponibilidade) só aparece se não há erro de formato */}
								{!errors.slug?.message && errorMessage && (
									<p className="text-sm text-destructive">{errorMessage}</p>
								)}

								{/* Sucesso só aparece se não há erros */}
								{showSuccess && !errors.slug && !errorMessage && (
									<p className="text-sm text-green-600">✓ Slug disponível</p>
								)}
							</div>
						</div>
					</FieldContent>
				</Field>

				{/* Preview da URL */}
				{inputValue && (
					<div className="rounded-lg border bg-muted/50 p-4">
						<p className="text-sm font-medium">Preview da sua URL:</p>
						<p className="text-sm text-muted-foreground break-all">
							https://webidelivery.com.br/{inputValue}
						</p>
					</div>
				)}

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
