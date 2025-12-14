"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
	getProgress,
	getStepsWithStatus,
	STEPS_CONFIG,
	useOnboardingStore,
} from "@/stores/onboardingStore";

/**
 * Hook para gerenciar onboarding com sincronização de URL
 * Usa Zustand store para estado compartilhado entre componentes
 * Gerencia URL params (?step=1, ?step=2, etc.) - 1-based
 */
export function useOnboarding() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Estado da store (compartilhado)
	const currentStep = useOnboardingStore((s) => s.currentStep);
	const formData = useOnboardingStore((s) => s.formData);
	const isLoading = useOnboardingStore((s) => s.isLoading);
	const setCurrentStep = useOnboardingStore((s) => s.setCurrentStep);
	const storeNextStep = useOnboardingStore((s) => s.nextStep);
	const storePrevStep = useOnboardingStore((s) => s.prevStep);
	const storeGoToStep = useOnboardingStore((s) => s.goToStep);
	const updateFormData = useOnboardingStore((s) => s.updateFormData);
	const setIsLoading = useOnboardingStore((s) => s.setIsLoading);
	const resetStore = useOnboardingStore((s) => s.resetOnboarding);

	// Estado de hidratação
	const [isHydrated, setIsHydrated] = useState(false);

	// Sincroniza step da URL com a store
	useEffect(() => {
		const urlStep = searchParams.get("step");
		if (urlStep !== null) {
			const parsed = Number.parseInt(urlStep, 10);
			// URL é 1-based, converte para 0-based
			const stepIndex = parsed - 1;
			if (!Number.isNaN(parsed) && stepIndex >= 0 && stepIndex < STEPS_CONFIG.length) {
				if (stepIndex !== currentStep) {
					setCurrentStep(stepIndex);
				}
			}
		}
		setIsHydrated(true);
	}, [searchParams, currentStep, setCurrentStep]);

	// Função para atualizar URL
	const updateUrl = useCallback(
		(stepIndex: number) => {
			// URL é 1-based
			const urlStep = stepIndex + 1;
			router.replace(`${pathname}?step=${urlStep}`, { scroll: false });
		},
		[pathname, router],
	);

	// Funções de navegação (atualizam store E URL)
	const nextStep = useCallback(() => {
		if (currentStep < STEPS_CONFIG.length - 1) {
			const newStep = currentStep + 1;
			storeNextStep();
			updateUrl(newStep);
		}
	}, [currentStep, storeNextStep, updateUrl]);

	const prevStep = useCallback(() => {
		if (currentStep > 0) {
			const newStep = currentStep - 1;
			storePrevStep();
			updateUrl(newStep);
		}
	}, [currentStep, storePrevStep, updateUrl]);

	const goToStep = useCallback(
		(stepIndex: number) => {
			if (stepIndex >= 0 && stepIndex < STEPS_CONFIG.length) {
				storeGoToStep(stepIndex);
				updateUrl(stepIndex);
			}
		},
		[storeGoToStep, updateUrl],
	);

	// Função para resetar onboarding
	const resetOnboarding = useCallback(() => {
		resetStore();
		updateUrl(0);
	}, [resetStore, updateUrl]);

	// Função para limpar storage (chamada após sucesso)
	const clearStorage = useCallback(() => {
		resetStore();
	}, [resetStore]);

	// Valores derivados
	const steps = getStepsWithStatus(currentStep);
	const progress = getProgress(currentStep);
	const isFirstStep = currentStep === 0;
	const isLastStep = currentStep === STEPS_CONFIG.length - 1;
	const canGoNext = currentStep < STEPS_CONFIG.length - 1;
	const canGoPrev = currentStep > 0;

	return {
		// Estado
		steps,
		currentStep,
		formData,
		isLoading,
		isHydrated,

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
		clearStorage,

		// Dados do step atual
		currentStepData: steps[currentStep],
	};
}

// Re-exportar tipos
export type { OnboardingStep } from "@/stores/onboardingStore";
