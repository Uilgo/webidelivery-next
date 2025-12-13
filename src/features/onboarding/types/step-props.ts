import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { OnboardingFormData } from "@/shared/schemas/onboarding";

/**
 * Props globais compartilhadas entre todos os steps do onboarding
 * Centralizadas no OnboardingForm para evitar duplicação
 */
export interface GlobalStepProps {
	register: UseFormRegister<OnboardingFormData>;
	errors: FieldErrors<OnboardingFormData>;
	watch: UseFormWatch<OnboardingFormData>;
	setValue: UseFormSetValue<OnboardingFormData>;
	isLoading: boolean;
	formatters: {
		whatsapp: (value: string) => string;
		cep: (value: string) => string;
	};
	handleFieldChange: (
		field: keyof OnboardingFormData,
		value: string,
		formatter?: (value: string) => string,
	) => void;
	isValid: boolean;
}

/**
 * Props específicas para validação de slug
 */
export interface SlugValidationProps {
	showSuccess: boolean;
	showError: boolean;
	showLoading: boolean;
	errorMessage: string | null;
	validateOnBlur: () => void;
}

/**
 * Props específicas para o PersonalizacaoStep
 */
export interface PersonalizacaoStepProps extends GlobalStepProps {
	slug: string;
	slugValidation: SlugValidationProps;
	onNext: () => void;
	onPrev: () => void;
}

/**
 * Opção de estado brasileiro
 */
export interface EstadoOption {
	value: string;
	label: string;
}
