"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { completeOnboarding } from "@/actions/onboarding";
import { useOnboarding } from "@/hooks/core/useOnboarding";
import { useSlugValidation } from "@/hooks/form/useSlugValidation";
import { formatCEP } from "@/lib/formatters/address";
import { formatWhatsApp } from "@/lib/formatters/phone";
import { type OnboardingFormData, onboardingSchema } from "@/shared/schemas/onboarding";
import { EmpresaStep } from "./EmpresaStep";
import { EnderecoStep } from "./EnderecoStep";
import { PersonalizacaoStep } from "./PersonalizacaoStep";
import { ReviewStep } from "./ReviewStep";

// Estados brasileiros
const ESTADOS_BRASILEIROS = [
	{ value: "AC", label: "Acre" },
	{ value: "AL", label: "Alagoas" },
	{ value: "AP", label: "Amapá" },
	{ value: "AM", label: "Amazonas" },
	{ value: "BA", label: "Bahia" },
	{ value: "CE", label: "Ceará" },
	{ value: "DF", label: "Distrito Federal" },
	{ value: "ES", label: "Espírito Santo" },
	{ value: "GO", label: "Goiás" },
	{ value: "MA", label: "Maranhão" },
	{ value: "MT", label: "Mato Grosso" },
	{ value: "MS", label: "Mato Grosso do Sul" },
	{ value: "MG", label: "Minas Gerais" },
	{ value: "PA", label: "Pará" },
	{ value: "PB", label: "Paraíba" },
	{ value: "PR", label: "Paraná" },
	{ value: "PE", label: "Pernambuco" },
	{ value: "PI", label: "Piauí" },
	{ value: "RJ", label: "Rio de Janeiro" },
	{ value: "RN", label: "Rio Grande do Norte" },
	{ value: "RS", label: "Rio Grande do Sul" },
	{ value: "RO", label: "Rondônia" },
	{ value: "RR", label: "Roraima" },
	{ value: "SC", label: "Santa Catarina" },
	{ value: "SP", label: "São Paulo" },
	{ value: "SE", label: "Sergipe" },
	{ value: "TO", label: "Tocantins" },
];

// Formatadores
const formatters = {
	whatsapp: formatWhatsApp,
	cep: formatCEP,
};

// Campos obrigatórios por step
const REQUIRED_FIELDS_BY_STEP: Record<number, (keyof OnboardingFormData)[]> = {
	0: ["nome", "whatsapp"],
	1: ["endereco_estado", "endereco_cidade", "endereco_bairro", "endereco_rua", "endereco_numero"],
	2: ["slug"],
};

/**
 * Componente principal do formulário de onboarding
 * Gerencia navegação entre steps, validação global e submissão final
 */
export function OnboardingForm() {
	const {
		currentStep,
		formData,
		isLoading,
		isHydrated,
		nextStep,
		prevStep,
		updateFormData,
		setIsLoading,
		goToStep,
		clearStorage,
	} = useOnboarding();

	// Formulário global com validação Zod
	const {
		register,
		formState: { errors },
		watch,
		setValue,
		trigger,
		getValues,
	} = useForm<OnboardingFormData>({
		resolver: zodResolver(onboardingSchema),
		defaultValues: formData,
		mode: "onChange",
	});

	// Hook para validação de slug em tempo real
	const {
		slug,
		handleSlugChange,
		validateOnBlur: validateSlugOnBlur,
		generateFromText,
		showSuccess: slugSuccess,
		showError: slugError,
		showLoading: slugLoading,
		error: slugErrorMessage,
	} = useSlugValidation();

	// Sincronizar dados do hook useOnboarding com react-hook-form
	useEffect(() => {
		Object.entries(formData).forEach(([key, value]) => {
			if (value !== undefined) {
				setValue(key as keyof OnboardingFormData, value);
			}
		});
	}, [formData, setValue]);

	// Gerar slug automaticamente quando nome da empresa muda
	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === "nome" && value.nome && !slug) {
				generateFromText(value.nome);
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, slug, generateFromText]);

	// Sincronizar slug com react-hook-form
	useEffect(() => {
		if (slug) {
			setValue("slug", slug);
		}
	}, [slug, setValue]);

	// Watch para reatividade
	const watchedValues = watch();

	// Obter campos obrigatórios do step atual
	const getRequiredFields = () => REQUIRED_FIELDS_BY_STEP[currentStep] || [];

	// Verificar se step atual tem dados válidos
	const checkStepValidity = () => {
		const requiredFields = getRequiredFields();

		// Verificar se todos os campos obrigatórios estão preenchidos
		const hasRequiredFields = requiredFields.every((field) => {
			const value = watchedValues[field];
			return value && value.toString().trim() !== "";
		});

		// Verificar se não há erros de validação nos campos obrigatórios
		const hasNoErrors = requiredFields.every((field) => !errors[field]);

		// Verificar slug (apenas no step 2) - deve ter slug válido E disponível
		const slugValid = currentStep !== 2 || (slug && slugSuccess && !slugError);

		return hasRequiredFields && hasNoErrors && slugValid;
	};

	const isCurrentStepValid = Boolean(checkStepValidity());

	// Validação por step
	const validateCurrentStep = async (): Promise<boolean> => {
		const fieldsToValidate = getRequiredFields();
		return await trigger(fieldsToValidate);
	};

	// Manipula navegação para próximo step
	const handleNext = async () => {
		const isValid = await validateCurrentStep();
		if (!isValid) return;

		// Pegar todos os valores do formulário
		const currentValues = getValues();

		// Garantir que os valores da store também sejam incluídos (para campos controlados externamente)
		const mergedValues = { ...formData, ...currentValues };
		updateFormData(mergedValues);
		nextStep();
	};

	// Manipula edição de um step específico
	const handleEdit = (stepIndex: number) => {
		goToStep(stepIndex);
	};

	// Manipula navegação para step anterior
	const handlePrev = () => {
		prevStep();
	};

	// Manipula mudança de campo com formatação automática
	const handleFieldChange = (
		field: keyof OnboardingFormData,
		value: string,
		formatter?: (value: string) => string,
	) => {
		const formattedValue = formatter ? formatter(value) : value;
		setValue(field, formattedValue, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: false,
		});

		// Atualizar store imediatamente para persistência
		updateFormData({ [field]: formattedValue });

		// Casos especiais
		if (field === "slug") {
			handleSlugChange(value);
		}
	};

	// Manipula conclusão do onboarding
	const handleComplete = async (completeData: OnboardingFormData) => {
		setIsLoading(true);

		try {
			await completeOnboarding(completeData);

			// Limpa localStorage após sucesso
			clearStorage();

			toast.success("Onboarding concluído com sucesso!", {
				description: "Redirecionando para o dashboard...",
			});
		} catch (error) {
			console.error("Erro ao finalizar onboarding:", error);

			const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";

			toast.error("Erro ao finalizar onboarding", {
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Props globais para todos os steps
	const globalStepProps = {
		register,
		errors,
		watch,
		setValue,
		isLoading,
		formatters,
		handleFieldChange,
		isValid: isCurrentStepValid,
	};

	// Aguarda hidratação para evitar mismatch de SSR
	if (!isHydrated) {
		return (
			<div className="w-full max-w-2xl flex items-center justify-center py-12">
				<div className="animate-pulse text-muted-foreground">Carregando...</div>
			</div>
		);
	}

	// Renderizar step atual
	switch (currentStep) {
		case 0:
			return (
				<div className="w-full max-w-2xl">
					<EmpresaStep {...globalStepProps} onNext={handleNext} />
				</div>
			);

		case 1:
			return (
				<div className="w-full max-w-2xl">
					<EnderecoStep
						{...globalStepProps}
						estados={ESTADOS_BRASILEIROS}
						onNext={handleNext}
						onPrev={handlePrev}
					/>
				</div>
			);

		case 2:
			return (
				<div className="w-full max-w-2xl">
					<PersonalizacaoStep
						{...globalStepProps}
						slug={slug}
						slugValidation={{
							showSuccess: slugSuccess,
							showError: slugError,
							showLoading: slugLoading,
							errorMessage: slugErrorMessage,
							validateOnBlur: validateSlugOnBlur,
							handleSlugChange,
						}}
						onNext={handleNext}
						onPrev={handlePrev}
					/>
				</div>
			);

		case 3: {
			// Mesclar dados do formulário com dados da store para garantir que todos os campos estejam presentes
			const reviewData = { ...formData, ...getValues() };
			return (
				<div className="w-full max-w-2xl">
					<ReviewStep
						formData={reviewData}
						onPrev={handlePrev}
						onComplete={handleComplete}
						onEdit={handleEdit}
						isLoading={isLoading}
					/>
				</div>
			);
		}

		default:
			return null;
	}
}
