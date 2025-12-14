"use client";

import { AlertCircle, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAutoCepLookup } from "@/hooks/form/useCepLookup";
import type { EstadoOption, GlobalStepProps } from "../types/step-props";

interface EnderecoStepProps extends GlobalStepProps {
	estados: EstadoOption[];
	onNext: () => void;
	onPrev: () => void;
}

/**
 * Step 2: Endereço da empresa
 * Estado, cidade, CEP, rua, número e ponto de referência
 * Agora usa props globais do OnboardingForm + busca automática de CEP
 */
export function EnderecoStep({
	register,
	errors,
	watch,
	setValue,
	isLoading,
	formatters,
	isValid,
	estados,
	onNext,
	onPrev,
}: EnderecoStepProps) {
	// IDs únicos para acessibilidade
	const estadoId = useId();
	const cidadeId = useId();
	const bairroId = useId();
	const cepId = useId();
	const ruaId = useId();
	const numeroId = useId();
	const complementoId = useId();
	const referenciaId = useId();

	// Estado local para o CEP (controlled input)
	const [cepValue, setCepValue] = useState(() => {
		const formValue = watch("endereco_cep");
		return formValue ?? "";
	});

	// Estado local para o Select de estado (Radix Select precisa de estado local para atualizar)
	const [estadoValue, setEstadoValue] = useState(() => {
		const formValue = watch("endereco_estado");
		return formValue ?? "";
	});

	// Busca automática de CEP com debounce
	const { isLoading: isCepLoading, error: cepError } = useAutoCepLookup(
		cepValue,
		(data) => {
			// Preencher campos automaticamente quando CEP for encontrado
			if (data.rua) setValue("endereco_rua", data.rua, { shouldValidate: true });
			if (data.bairro) setValue("endereco_bairro", data.bairro, { shouldValidate: true });
			if (data.cidade) setValue("endereco_cidade", data.cidade, { shouldValidate: true });
			if (data.estado) {
				// Atualizar estado local E o form
				setEstadoValue(data.estado);
				setValue("endereco_estado", data.estado, { shouldValidate: true });
			}
		},
		500,
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isValid) {
			onNext();
		}
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Endereço</h2>
				<p className="text-muted-foreground">Onde está localizado seu estabelecimento?</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Linha 1: CEP + Estado + Cidade */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
					{/* CEP */}
					<Field className="md:col-span-4">
						<FieldLabel htmlFor={cepId}>CEP (opcional)</FieldLabel>
						<FieldContent>
							<div className="relative">
								<Input
									id={cepId}
									type="text"
									placeholder="12345-678"
									maxLength={9}
									disabled={isLoading}
									value={cepValue}
									onChange={(e) => {
										const formatted = formatters.cep(e.target.value);
										setCepValue(formatted);
										setValue("endereco_cep", formatted, { shouldValidate: true });
									}}
									aria-invalid={!!errors.endereco_cep || !!cepError}
									className={cepError ? "pr-10 border-destructive" : isCepLoading ? "pr-10" : ""}
								/>

								{/* Indicador de status do CEP */}
								<div className="absolute right-3 top-1/2 -translate-y-1/2">
									{isCepLoading && (
										<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
									)}
									{!isCepLoading && cepValue && !cepError && watch("endereco_rua") && (
										<CheckCircle2 className="h-4 w-4 text-green-600" />
									)}
									{!isCepLoading && cepError && (
										<AlertCircle className="h-4 w-4 text-destructive" />
									)}
								</div>
							</div>
							<FieldError>{errors.endereco_cep?.message}</FieldError>
						</FieldContent>
					</Field>

					{/* Estado */}
					<Field className="md:col-span-4">
						<FieldLabel htmlFor={estadoId}>Estado *</FieldLabel>
						<FieldContent>
							<Select
								value={estadoValue}
								onValueChange={(value) => {
									setEstadoValue(value);
									setValue("endereco_estado", value, { shouldValidate: true });
								}}
								disabled={isLoading}
								name="endereco_estado"
							>
								<SelectTrigger id={estadoId} aria-invalid={!!errors.endereco_estado}>
									<SelectValue placeholder="Selecione o estado" />
								</SelectTrigger>
								<SelectContent>
									{estados.map((estado) => (
										<SelectItem key={estado.value} value={estado.value}>
											{estado.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError>{errors.endereco_estado?.message}</FieldError>
						</FieldContent>
					</Field>

					{/* Cidade */}
					<Field className="md:col-span-4">
						<FieldLabel htmlFor={cidadeId}>Cidade *</FieldLabel>
						<FieldContent>
							<Input
								{...register("endereco_cidade")}
								id={cidadeId}
								type="text"
								placeholder="Ex: São Paulo"
								disabled={isLoading}
								aria-invalid={!!errors.endereco_cidade}
							/>
							<FieldError>{errors.endereco_cidade?.message}</FieldError>
						</FieldContent>
					</Field>
				</div>

				{/* Mensagens de feedback do CEP */}
				{(cepError || (!isCepLoading && !cepError && cepValue && watch("endereco_rua"))) && (
					<div className="space-y-1">
						{/* Mensagem de erro do CEP */}
						{cepError && (
							<p className="text-sm text-destructive flex items-center gap-1">
								<AlertCircle className="h-3 w-3" />
								{cepError.message}
							</p>
						)}

						{/* Mensagem de sucesso */}
						{!isCepLoading && !cepError && cepValue && watch("endereco_rua") && (
							<p className="text-sm text-green-600 flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								Endereço encontrado automaticamente
							</p>
						)}
					</div>
				)}

				{/* Linha 2: Bairro + Rua + Número */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
					{/* Bairro */}
					<Field className="md:col-span-4">
						<FieldLabel htmlFor={bairroId}>Bairro *</FieldLabel>
						<FieldContent>
							<Input
								{...register("endereco_bairro")}
								id={bairroId}
								type="text"
								placeholder="Ex: Centro"
								disabled={isLoading}
								aria-invalid={!!errors.endereco_bairro}
							/>
							<FieldError>{errors.endereco_bairro?.message}</FieldError>
						</FieldContent>
					</Field>

					{/* Rua */}
					<Field className="md:col-span-6">
						<FieldLabel htmlFor={ruaId}>Rua *</FieldLabel>
						<FieldContent>
							<Input
								{...register("endereco_rua")}
								id={ruaId}
								type="text"
								placeholder="Ex: Rua das Flores"
								disabled={isLoading}
								aria-invalid={!!errors.endereco_rua}
							/>
							<FieldError>{errors.endereco_rua?.message}</FieldError>
						</FieldContent>
					</Field>

					{/* Número */}
					<Field className="md:col-span-2">
						<FieldLabel htmlFor={numeroId}>Número *</FieldLabel>
						<FieldContent>
							<Input
								{...register("endereco_numero")}
								id={numeroId}
								type="text"
								placeholder="123"
								disabled={isLoading}
								aria-invalid={!!errors.endereco_numero}
							/>
							<FieldError>{errors.endereco_numero?.message}</FieldError>
						</FieldContent>
					</Field>
				</div>

				{/* Linha 3: Complemento + Ponto de Referência */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Complemento */}
					<Field>
						<FieldLabel htmlFor={complementoId}>Complemento (opcional)</FieldLabel>
						<FieldContent>
							<Input
								{...register("endereco_complemento")}
								id={complementoId}
								type="text"
								placeholder="Ex: Apto 101, Bloco A"
								disabled={isLoading}
								aria-invalid={!!errors.endereco_complemento}
							/>
							<FieldError>{errors.endereco_complemento?.message}</FieldError>
						</FieldContent>
					</Field>

					{/* Ponto de Referência */}
					<Field>
						<FieldLabel htmlFor={referenciaId}>Ponto de Referência (opcional)</FieldLabel>
						<FieldContent>
							<Input
								{...register("endereco_referencia")}
								id={referenciaId}
								type="text"
								placeholder="Ex: Próximo ao shopping"
								disabled={isLoading}
								aria-invalid={!!errors.endereco_referencia}
							/>
							<FieldError>{errors.endereco_referencia?.message}</FieldError>
						</FieldContent>
					</Field>
				</div>

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
