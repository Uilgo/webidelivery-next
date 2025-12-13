"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
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

/**
 * Componente principal do formulário de onboarding
 * Gerencia navegação entre steps, validação global e submissão final
 * Centraliza toda a lógica para desafogar os steps individuais
 */
export function OnboardingForm() {
	const {
		currentStep,
		formData,
		isLoading,
		nextStep,
		prevStep,
		updateFormData,
		setIsLoading,
		goToStep,
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
		mode: "onBlur",
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

	// Estados brasileiros (centralizados)
	const estadosBrasileiros = useMemo(
		() => [
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
		],
		[],
	);

	// Funções de formatação centralizadas (importadas da lib)
	const formatters = useMemo(
		() => ({
			whatsapp: formatWhatsApp,
			cep: formatCEP,
		}),
		[],
	);

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

	// Validação por step
	const validateCurrentStep = async (): Promise<boolean> => {
		const fieldsToValidate = getFieldsForCurrentStep();
		return await trigger(fieldsToValidate);
	};

	// Obter campos para validação do step atual
	const getFieldsForCurrentStep = (): (keyof OnboardingFormData)[] => {
		switch (currentStep) {
			case 0:
				return ["nome", "descricao", "whatsapp"];
			case 1:
				return [
					"endereco_estado",
					"endereco_cidade",
					"endereco_bairro",
					"endereco_rua",
					"endereco_numero",
					"endereco_cep",
					"endereco_complemento",
					"endereco_referencia",
				];
			case 2:
				return ["slug"];
			default:
				return [];
		}
	};

	// Verificar se step atual tem dados válidos
	const isCurrentStepValid = (): boolean => {
		const fields = getFieldsForCurrentStep();
		const currentValues = getValues();
		const hasRequiredFields = fields.every((field) => {
			const value = currentValues[field];
			// Campos obrigatórios por step
			const requiredFields =
				{
					0: ["nome", "whatsapp"],
					1: [
						"endereco_estado",
						"endereco_cidade",
						"endereco_bairro",
						"endereco_rua",
						"endereco_numero",
					],
					2: ["slug"],
				}[currentStep] || [];

			return !requiredFields.includes(field) || (value && value.toString().trim() !== "");
		});

		const hasNoErrors = fields.every((field) => !errors[field]);
		const slugValid = currentStep !== 2 || slugSuccess;

		return hasRequiredFields && hasNoErrors && slugValid;
	};

	/**
	 * Manipula navegação para próximo step
	 */
	const handleNext = async () => {
		const isValid = await validateCurrentStep();
		if (!isValid) return;

		const currentValues = getValues();
		updateFormData(currentValues);
		nextStep();
	};

	/**
	 * Manipula edição de um step específico
	 */
	const handleEdit = (stepIndex: number) => {
		goToStep(stepIndex);
	};

	/**
	 * Manipula navegação para step anterior
	 */
	const handlePrev = () => {
		prevStep();
	};

	/**
	 * Manipula mudança de campo com formatação automática
	 */
	const handleFieldChange = (
		field: keyof OnboardingFormData,
		value: string,
		formatter?: (value: string) => string,
	) => {
		const formattedValue = formatter ? formatter(value) : value;
		setValue(field, formattedValue);

		// Casos especiais
		if (field === "slug") {
			handleSlugChange(value);
		}
	};

	/**
	 * Manipula conclusão do onboarding
	 */
	const handleComplete = async (completeData: OnboardingFormData) => {
		setIsLoading(true);

		try {
			// Chamar Server Action para salvar dados
			await completeOnboarding(completeData);

			// Sucesso será tratado pelo redirect da Server Action
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
		isValid: isCurrentStepValid(),
	};

	// Renderizar step atual
	const renderCurrentStep = () => {
		switch (currentStep) {
			case 0:
				return <EmpresaStep {...globalStepProps} onNext={handleNext} />;

			case 1:
				return (
					<EnderecoStep
						{...globalStepProps}
						estados={estadosBrasileiros}
						onNext={handleNext}
						onPrev={handlePrev}
					/>
				);

			case 2:
				return (
					<PersonalizacaoStep
						{...globalStepProps}
						slug={slug}
						slugValidation={{
							showSuccess: slugSuccess,
							showError: slugError,
							showLoading: slugLoading,
							errorMessage: slugErrorMessage,
							validateOnBlur: validateSlugOnBlur,
						}}
						onNext={handleNext}
						onPrev={handlePrev}
					/>
				);

			case 3:
				return (
					<ReviewStep
						formData={getValues()}
						onPrev={handlePrev}
						onComplete={handleComplete}
						onEdit={handleEdit}
						isLoading={isLoading}
					/>
				);

			default:
				return null;
		}
	};

	return <div className="w-full max-w-2xl">{renderCurrentStep()}</div>;
}
