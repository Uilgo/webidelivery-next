import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnboardingFormData } from "@/shared/schemas/onboarding";

/**
 * Store Zustand para gerenciar estado do onboarding
 * - Compartilha estado entre componentes
 * - Persiste dados no localStorage automaticamente
 * - URL é gerenciada separadamente pelo hook
 */

// Chave para localStorage
const STORAGE_KEY = "webidelivery_onboarding";

export interface OnboardingStep {
	id: string;
	title: string;
	description: string;
}

// Definição dos steps
export const STEPS_CONFIG: OnboardingStep[] = [
	{
		id: "empresa",
		title: "Dados da Empresa",
		description: "Informações básicas do seu estabelecimento",
	},
	{
		id: "endereco",
		title: "Endereço",
		description: "Localização do seu estabelecimento",
	},
	{
		id: "personalizacao",
		title: "Personalização",
		description: "URL personalizada e logo",
	},
	{
		id: "review",
		title: "Revisão",
		description: "Confirme suas informações",
	},
];

interface OnboardingState {
	// Estado
	currentStep: number;
	formData: Partial<OnboardingFormData>;
	isLoading: boolean;

	// Ações
	setCurrentStep: (step: number) => void;
	nextStep: () => void;
	prevStep: () => void;
	goToStep: (step: number) => void;
	updateFormData: (data: Partial<OnboardingFormData>) => void;
	setIsLoading: (loading: boolean) => void;
	resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
	persist(
		(set, get) => ({
			// Estado inicial
			currentStep: 0,
			formData: {},
			isLoading: false,

			// Ações
			setCurrentStep: (step) => {
				if (step >= 0 && step < STEPS_CONFIG.length) {
					set({ currentStep: step });
				}
			},

			nextStep: () => {
				const { currentStep } = get();
				if (currentStep < STEPS_CONFIG.length - 1) {
					set({ currentStep: currentStep + 1 });
				}
			},

			prevStep: () => {
				const { currentStep } = get();
				if (currentStep > 0) {
					set({ currentStep: currentStep - 1 });
				}
			},

			goToStep: (step) => {
				if (step >= 0 && step < STEPS_CONFIG.length) {
					set({ currentStep: step });
				}
			},

			updateFormData: (data) => {
				set((state) => ({
					formData: { ...state.formData, ...data },
				}));
			},

			setIsLoading: (loading) => set({ isLoading: loading }),

			resetOnboarding: () => {
				set({
					currentStep: 0,
					formData: {},
					isLoading: false,
				});
			},
		}),
		{
			name: STORAGE_KEY,
			// Persistir apenas formData e currentStep
			partialize: (state) => ({
				currentStep: state.currentStep,
				formData: state.formData,
			}),
		},
	),
);

// Seletores derivados (para usar fora do componente)
export const getStepsWithStatus = (currentStep: number) =>
	STEPS_CONFIG.map((step, index) => ({
		...step,
		completed: currentStep > index,
		current: currentStep === index,
	}));

export const getProgress = (currentStep: number) => ((currentStep + 1) / STEPS_CONFIG.length) * 100;
