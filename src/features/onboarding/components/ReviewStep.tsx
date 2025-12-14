"use client";

import { AlertCircle, Building2, Check, Edit2, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFullAddress } from "@/lib/formatters/address";
import { formatWhatsApp } from "@/lib/formatters/phone";
import type { OnboardingFormData } from "@/shared/schemas/onboarding";

interface ReviewStepProps {
	formData: Partial<OnboardingFormData>;
	onPrev: () => void;
	onComplete: (data: OnboardingFormData) => void;
	onEdit: (stepIndex: number) => void;
	isLoading?: boolean;
}

// Mapeamento de campos obrigatórios por step com labels amigáveis
const REQUIRED_FIELDS = {
	0: [
		{ field: "nome", label: "Nome da Empresa" },
		{ field: "whatsapp", label: "WhatsApp" },
	],
	1: [
		{ field: "endereco_estado", label: "Estado" },
		{ field: "endereco_cidade", label: "Cidade" },
		{ field: "endereco_bairro", label: "Bairro" },
		{ field: "endereco_rua", label: "Rua" },
		{ field: "endereco_numero", label: "Número" },
	],
	2: [{ field: "slug", label: "URL Personalizada" }],
} as const;

// Nomes dos steps para exibição
const STEP_NAMES = {
	0: "Dados da Empresa",
	1: "Endereço",
	2: "Personalização",
} as const;

// Função auxiliar para verificar campos faltando por step
const getMissingFieldsByStep = (formData: Partial<OnboardingFormData>) => {
	const missing: Record<number, { field: string; label: string }[]> = {};

	for (const [stepKey, fields] of Object.entries(REQUIRED_FIELDS)) {
		const stepIndex = Number(stepKey);
		const missingFields = fields.filter((f) => {
			const value = formData[f.field as keyof typeof formData];
			return !value || String(value).trim() === "";
		});

		if (missingFields.length > 0) {
			missing[stepIndex] = missingFields;
		}
	}

	return missing;
};

// Função auxiliar para formatar endereço
const formatAddressFromData = (formData: Partial<OnboardingFormData>) => {
	return formatFullAddress({
		rua: formData.endereco_rua || undefined,
		numero: formData.endereco_numero || undefined,
		complemento: formData.endereco_complemento || undefined,
		bairro: formData.endereco_bairro || undefined,
		cidade: formData.endereco_cidade || undefined,
		estado: formData.endereco_estado || undefined,
		cep: formData.endereco_cep || undefined,
	});
};

// Componente para o card de dados da empresa
function EmpresaCard({
	formData,
	stepHasErrors,
	onEdit,
	isLoading,
}: {
	formData: Partial<OnboardingFormData>;
	stepHasErrors: boolean;
	onEdit: (step: number) => void;
	isLoading?: boolean;
}) {
	return (
		<Card className={stepHasErrors ? "border-red-300 dark:border-red-700" : ""}>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Building2 className={`h-5 w-5 ${stepHasErrors ? "text-red-500" : "text-primary"}`} />
						<CardTitle className="text-lg">Dados da Empresa</CardTitle>
						{stepHasErrors && <AlertCircle className="h-4 w-4 text-red-500" />}
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onEdit(0)}
						disabled={isLoading}
						className="h-8 px-2"
						aria-label="Editar dados da empresa"
					>
						<Edit2 className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<dl className="space-y-3">
					<div>
						<dt className="text-sm font-medium text-muted-foreground">Nome da Empresa</dt>
						<dd className={`text-base ${!formData.nome ? "text-red-500 italic" : ""}`}>
							{formData.nome || "Não informado"}
						</dd>
					</div>

					{formData.descricao && (
						<div>
							<dt className="text-sm font-medium text-muted-foreground">Descrição</dt>
							<dd className="text-base">{formData.descricao}</dd>
						</div>
					)}

					<div>
						<dt className="text-sm font-medium text-muted-foreground">WhatsApp</dt>
						<dd className={`text-base ${!formData.whatsapp ? "text-red-500 italic" : ""}`}>
							{formData.whatsapp ? formatWhatsApp(formData.whatsapp) : "Não informado"}
						</dd>
					</div>
				</dl>
			</CardContent>
		</Card>
	);
}

// Componente para o card de endereço
function EnderecoCard({
	formData,
	stepHasErrors,
	onEdit,
	isLoading,
}: {
	formData: Partial<OnboardingFormData>;
	stepHasErrors: boolean;
	onEdit: (step: number) => void;
	isLoading?: boolean;
}) {
	const address = formatAddressFromData(formData);

	return (
		<Card className={stepHasErrors ? "border-red-300 dark:border-red-700" : ""}>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<MapPin className={`h-5 w-5 ${stepHasErrors ? "text-red-500" : "text-primary"}`} />
						<CardTitle className="text-lg">Endereço</CardTitle>
						{stepHasErrors && <AlertCircle className="h-4 w-4 text-red-500" />}
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onEdit(1)}
						disabled={isLoading}
						className="h-8 px-2"
						aria-label="Editar endereço"
					>
						<Edit2 className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<dl className="space-y-3">
					<div>
						<dt className="text-sm font-medium text-muted-foreground">Endereço Completo</dt>
						<dd className={`text-base ${!address ? "text-red-500 italic" : ""}`}>
							{address || "Não informado"}
						</dd>
					</div>

					{formData.endereco_cep && (
						<div>
							<dt className="text-sm font-medium text-muted-foreground">CEP</dt>
							<dd className="text-base">{formData.endereco_cep}</dd>
						</div>
					)}

					{formData.endereco_referencia && (
						<div>
							<dt className="text-sm font-medium text-muted-foreground">Ponto de Referência</dt>
							<dd className="text-base">{formData.endereco_referencia}</dd>
						</div>
					)}
				</dl>
			</CardContent>
		</Card>
	);
}

// Componente para o card de personalização
function PersonalizacaoCard({
	formData,
	stepHasErrors,
	onEdit,
	isLoading,
}: {
	formData: Partial<OnboardingFormData>;
	stepHasErrors: boolean;
	onEdit: (step: number) => void;
	isLoading?: boolean;
}) {
	return (
		<Card className={stepHasErrors ? "border-red-300 dark:border-red-700" : ""}>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Globe className={`h-5 w-5 ${stepHasErrors ? "text-red-500" : "text-primary"}`} />
						<CardTitle className="text-lg">Personalização</CardTitle>
						{stepHasErrors && <AlertCircle className="h-4 w-4 text-red-500" />}
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onEdit(2)}
						disabled={isLoading}
						className="h-8 px-2"
						aria-label="Editar personalização"
					>
						<Edit2 className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<dl className="space-y-3">
					<div>
						<dt className="text-sm font-medium text-muted-foreground">URL Personalizada</dt>
						<dd className={`text-base font-mono ${!formData.slug ? "text-red-500 italic" : ""}`}>
							{formData.slug ? `webidelivery.com.br/${formData.slug}` : "Não informado"}
						</dd>
					</div>

					{/* Logos lado a lado */}
					{(formData.logo_url || formData.logo_url_dark) && (
						<div className="flex gap-6">
							{formData.logo_url && (
								<div>
									<dt className="text-sm font-medium text-muted-foreground">Logo (Tema Claro)</dt>
									<dd className="mt-2">
										<Image
											src={formData.logo_url}
											alt="Logo da empresa (tema claro)"
											width={64}
											height={64}
											className="h-16 w-16 rounded-lg border object-cover"
										/>
									</dd>
								</div>
							)}
							{formData.logo_url_dark && (
								<div>
									<dt className="text-sm font-medium text-muted-foreground">Logo (Tema Escuro)</dt>
									<dd className="mt-2">
										<Image
											src={formData.logo_url_dark}
											alt="Logo da empresa (tema escuro)"
											width={64}
											height={64}
											className="h-16 w-16 rounded-lg border object-cover"
										/>
									</dd>
								</div>
							)}
						</div>
					)}
				</dl>
			</CardContent>
		</Card>
	);
}

/**
 * Step 4: Revisão dos dados do onboarding
 * Permite ao usuário revisar e confirmar todas as informações antes de finalizar
 */
export function ReviewStep({ formData, onPrev, onComplete, onEdit, isLoading }: ReviewStepProps) {
	const missingFieldsByStep = getMissingFieldsByStep(formData);
	const hasErrors = Object.keys(missingFieldsByStep).length > 0;

	const handleComplete = () => {
		if (hasErrors) return;
		onComplete(formData as OnboardingFormData);
	};

	// Verifica se um step específico tem erros
	const stepHasErrors = (stepIndex: number) => !!missingFieldsByStep[stepIndex];

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Revisão dos Dados</h2>
				<p className="text-muted-foreground">
					Revise suas informações antes de finalizar o cadastro
				</p>
			</div>

			{/* Alerta de campos obrigatórios faltando */}
			{hasErrors && (
				<Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
					<CardHeader className="pb-3">
						<div className="flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-red-600" />
							<CardTitle className="text-lg text-red-900 dark:text-red-100">
								Campos Obrigatórios Faltando
							</CardTitle>
						</div>
						<CardDescription className="text-red-700 dark:text-red-300">
							Preencha os campos abaixo para finalizar o cadastro:
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{Object.entries(missingFieldsByStep).map(([stepKey, fields]) => {
							const stepIndex = Number(stepKey);
							return (
								<div key={stepKey} className="flex items-start justify-between gap-4">
									<div>
										<p className="font-medium text-red-900 dark:text-red-100">
											{STEP_NAMES[stepIndex as keyof typeof STEP_NAMES]}
										</p>
										<p className="text-sm text-red-700 dark:text-red-300">
											{fields.map((f) => f.label).join(", ")}
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onEdit(stepIndex)}
										disabled={isLoading}
										className="shrink-0 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
									>
										<Edit2 className="mr-1 h-3 w-3" />
										Editar
									</Button>
								</div>
							);
						})}
					</CardContent>
				</Card>
			)}

			<div className="space-y-4">
				<EmpresaCard
					formData={formData}
					stepHasErrors={stepHasErrors(0)}
					onEdit={onEdit}
					isLoading={isLoading}
				/>

				<EnderecoCard
					formData={formData}
					stepHasErrors={stepHasErrors(1)}
					onEdit={onEdit}
					isLoading={isLoading}
				/>

				<PersonalizacaoCard
					formData={formData}
					stepHasErrors={stepHasErrors(2)}
					onEdit={onEdit}
					isLoading={isLoading}
				/>

				{/* Card de Confirmação - só mostra se não houver erros */}
				{!hasErrors && (
					<Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
						<CardHeader className="pb-3">
							<div className="flex items-center gap-2">
								<Check className="h-5 w-5 text-green-600" />
								<CardTitle className="text-lg text-green-900 dark:text-green-100">
									Pronto para Começar!
								</CardTitle>
							</div>
							<CardDescription className="text-green-700 dark:text-green-300">
								Após finalizar, você será redirecionado para o painel administrativo onde poderá
								configurar seu cardápio e começar a receber pedidos.
							</CardDescription>
						</CardHeader>
					</Card>
				)}
			</div>

			{/* Botões de Navegação */}
			<div className="flex justify-between pt-4 pb-8">
				<Button type="button" variant="outline" onClick={onPrev} disabled={isLoading}>
					Voltar
				</Button>
				<Button
					onClick={handleComplete}
					disabled={isLoading || hasErrors}
					className="min-w-[120px]"
				>
					{isLoading ? "Finalizando..." : "Finalizar Cadastro"}
				</Button>
			</div>
		</div>
	);
}
