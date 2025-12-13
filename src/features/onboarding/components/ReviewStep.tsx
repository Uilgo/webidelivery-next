"use client";

import { Building2, Check, Edit2, Globe, MapPin } from "lucide-react";
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

/**
 * Step 4: Revisão dos dados do onboarding
 * Permite ao usuário revisar e confirmar todas as informações antes de finalizar
 */
export function ReviewStep({ formData, onPrev, onComplete, onEdit, isLoading }: ReviewStepProps) {
	/**
	 * Manipula a finalização do onboarding
	 */
	const handleComplete = () => {
		// Verificar se todos os dados estão presentes
		if (!isFormDataComplete(formData)) {
			return;
		}

		onComplete(formData as OnboardingFormData);
	};

	/**
	 * Verifica se todos os dados obrigatórios estão presentes
	 */
	const isFormDataComplete = (data: Partial<OnboardingFormData>): boolean => {
		return !!(
			data.nome &&
			data.whatsapp &&
			data.endereco_estado &&
			data.endereco_cidade &&
			data.endereco_bairro &&
			data.endereco_rua &&
			data.endereco_numero &&
			data.slug
		);
	};

	/**
	 * Formatar endereço completo usando formatter da lib
	 */
	const formatAddress = () => {
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

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Revisão dos Dados</h2>
				<p className="text-muted-foreground">
					Revise suas informações antes de finalizar o cadastro
				</p>
			</div>

			<div className="space-y-4">
				{/* Card: Dados da Empresa */}
				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Building2 className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">Dados da Empresa</CardTitle>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onEdit(0)}
								disabled={isLoading}
								className="h-8 px-2"
							>
								<Edit2 className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<p className="text-sm font-medium text-muted-foreground">Nome da Empresa</p>
							<p className="text-base">{formData.nome || "—"}</p>
						</div>

						{formData.descricao && (
							<div>
								<p className="text-sm font-medium text-muted-foreground">Descrição</p>
								<p className="text-base">{formData.descricao}</p>
							</div>
						)}

						<div>
							<p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
							<p className="text-base">
								{formData.whatsapp ? formatWhatsApp(formData.whatsapp) : "—"}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Card: Endereço */}
				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<MapPin className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">Endereço</CardTitle>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onEdit(1)}
								disabled={isLoading}
								className="h-8 px-2"
							>
								<Edit2 className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<p className="text-sm font-medium text-muted-foreground">Endereço Completo</p>
							<p className="text-base">{formatAddress() || "—"}</p>
						</div>

						{formData.endereco_cep && (
							<div>
								<p className="text-sm font-medium text-muted-foreground">CEP</p>
								<p className="text-base">{formData.endereco_cep}</p>
							</div>
						)}

						{formData.endereco_referencia && (
							<div>
								<p className="text-sm font-medium text-muted-foreground">Ponto de Referência</p>
								<p className="text-base">{formData.endereco_referencia}</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Card: Personalização */}
				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Globe className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">Personalização</CardTitle>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onEdit(2)}
								disabled={isLoading}
								className="h-8 px-2"
							>
								<Edit2 className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<p className="text-sm font-medium text-muted-foreground">URL Personalizada</p>
							<p className="text-base font-mono">
								{formData.slug ? `webidelivery.com.br/${formData.slug}` : "—"}
							</p>
						</div>

						{formData.logo_url && (
							<div>
								<p className="text-sm font-medium text-muted-foreground">Logo</p>
								<div className="mt-2">
									<Image
										src={formData.logo_url}
										alt="Logo da empresa"
										width={64}
										height={64}
										className="h-16 w-16 rounded-lg border object-cover"
									/>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Card de Confirmação */}
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
			</div>

			{/* Botões de Navegação */}
			<div className="flex justify-between pt-4">
				<Button type="button" variant="outline" onClick={onPrev} disabled={isLoading}>
					Voltar
				</Button>
				<Button
					onClick={handleComplete}
					disabled={isLoading || !isFormDataComplete(formData)}
					className="min-w-[120px]"
				>
					{isLoading ? "Finalizando..." : "Finalizar Cadastro"}
				</Button>
			</div>
		</div>
	);
}
