"use client";

import { useState } from "react";
import type { OnboardingFormData } from "@/shared/schemas/onboarding";

/**
 * Hook para gerenciar estado do onboarding
 * Controla navegação entre steps e dados do formulário
 */

export interface OnboardingStep {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	current: boolean;
}

export function useOnboarding() {
	// Estado dos steps
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});
	const [isLoading, setIsLoading] = useState(false);

	// Definição dos steps
	const steps: OnboardingStep[] = [
		{
			id: "empresa",
			title: "Dados da Empresa",
			description: "Informações básicas do seu estabelecimento",
			completed: currentStep > 0,
			current: currentStep === 0,
		},
		{
			id: "endereco",
			title: "Endereço",
			description: "Localização do seu estabelecimento",
			completed: currentStep > 1,
			current: currentStep === 1,
		},
		{
			id: "personalizacao",
			title: "Personalização",
			description: "URL personalizada e logo",
			completed: currentStep > 2,
			current: currentStep === 2,
		},
		{
			id: "review",
			title: "Revisão",
			description: "Confirme suas informações",
			completed: currentStep > 3,
			current: currentStep === 3,
		},
	];

	// Funções de navegação
	const nextStep = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const goToStep = (stepIndex: number) => {
		if (stepIndex >= 0 && stepIndex < steps.length) {
			setCurrentStep(stepIndex);
		}
	};

	// Função para atualizar dados do formulário
	const updateFormData = (data: Partial<OnboardingFormData>) => {
		setFormData((prev) => ({ ...prev, ...data }));
	};

	// Função para resetar onboarding
	const resetOnboarding = () => {
		setCurrentStep(0);
		setFormData({});
		setIsLoading(false);
	};

	// Estados derivados
	const isFirstStep = currentStep === 0;
	const isLastStep = currentStep === steps.length - 1;
	const canGoNext = currentStep < steps.length - 1;
	const canGoPrev = currentStep > 0;
	const progress = ((currentStep + 1) / steps.length) * 100;

	return {
		// Estado
		steps,
		currentStep,
		formData,
		isLoading,

		// Estados derivados
		isFirstStep,
		isLastStep,
		canGoNext,
		canGoPrev,
		progress,

		// Ações
		nextStep,
		prevStep,
		goToStep,
		updateFormData,
		resetOnboarding,
		setIsLoading,

		// Dados do step atual
		currentStepData: steps[currentStep],
	};
}
