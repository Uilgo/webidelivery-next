"use client";

import { AlertCircle, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { useId } from "react";
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
	handleFieldChange,
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

	// Busca automática de CEP
	const { isLoading: isCepLoading, error: cepError } = useAutoCepLookup(
		watch("endereco_cep") || "",
		(data) => {
			// Preencher campos automaticamente quando CEP for encontrado
			if (data.rua && !watch("endereco_rua")) {
				setValue("endereco_rua", data.rua);
			}
			if (data.bairro && !watch("endereco_bairro")) {
				setValue("endereco_bairro", data.bairro);
			}
			if (data.cidade && !watch("endereco_cidade")) {
				setValue("endereco_cidade", data.cidade);
			}
			if (data.estado && !watch("endereco_estado")) {
				setValue("endereco_estado", data.estado);
			}
		},
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

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Estado e Cidade */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Estado */}
					<Field>
						<FieldLabel htmlFor={estadoId}>Estado *</FieldLabel>
						<FieldContent>
							<Select
								value={watch("endereco_estado")}
								onValueChange={(value) => setValue("endereco_estado", value)}
								disabled={isLoading}
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
					<Field>
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

				{/* Bairro e CEP */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Bairro */}
					<Field>
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

					{/* CEP */}
					<Field>
						<FieldLabel htmlFor={cepId}>CEP (opcional)</FieldLabel>
						<FieldContent>
							<div className="relative">
								<Input
									{...register("endereco_cep", {
										onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
											handleFieldChange("endereco_cep", e.target.value, formatters.cep);
										},
									})}
									id={cepId}
									type="text"
									placeholder="12345-678"
									maxLength={9}
									disabled={isLoading}
									aria-invalid={!!errors.endereco_cep || !!cepError}
									className={cepError ? "pr-10 border-destructive" : isCepLoading ? "pr-10" : ""}
								/>

								{/* Indicador de status do CEP */}
								<div className="absolute right-3 top-1/2 -translate-y-1/2">
									{isCepLoading && (
										<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
									)}
									{!isCepLoading && watch("endereco_cep") && !cepError && watch("endereco_rua") && (
										<CheckCircle2 className="h-4 w-4 text-green-600" />
									)}
									{!isCepLoading && cepError && (
										<AlertCircle className="h-4 w-4 text-destructive" />
									)}
								</div>
							</div>

							{/* Mensagem de erro do CEP */}
							{cepError && (
								<p className="text-sm text-destructive mt-1 flex items-center gap-1">
									<AlertCircle className="h-3 w-3" />
									{cepError.message}
								</p>
							)}

							{/* Mensagem de sucesso */}
							{!isCepLoading && !cepError && watch("endereco_cep") && watch("endereco_rua") && (
								<p className="text-sm text-green-600 mt-1 flex items-center gap-1">
									<MapPin className="h-3 w-3" />
									Endereço encontrado automaticamente
								</p>
							)}

							<FieldError>{errors.endereco_cep?.message}</FieldError>
						</FieldContent>
					</Field>
				</div>

				{/* Rua e Número */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Rua */}
					<Field className="md:col-span-2">
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
					<Field>
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

				{/* Complemento e Referência */}
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
