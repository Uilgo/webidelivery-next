"use client";

import { Check, Loader2, X } from "lucide-react";
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputWithValidationProps extends React.InputHTMLAttributes<HTMLInputElement> {
	isValid?: boolean;
	isChecking?: boolean;
	showSuccess?: boolean;
	showError?: boolean;
	showLoading?: boolean;
}

/**
 * Componente Input com indicadores visuais de validação
 * Mostra ícones de sucesso, erro ou loading no lado direito
 */
const InputWithValidation = forwardRef<HTMLInputElement, InputWithValidationProps>(
	({ className, isValid, isChecking, showSuccess, showError, showLoading, ...props }, ref) => {
		// Determinar qual ícone mostrar
		const renderValidationIcon = () => {
			if (showLoading || isChecking) {
				return (
					<Loader2
						className="h-4 w-4 animate-spin text-muted-foreground"
						aria-label="Verificando"
					/>
				);
			}

			if (showSuccess) {
				return <Check className="h-4 w-4 text-green-600" aria-label="Válido" />;
			}

			if (showError) {
				return <X className="h-4 w-4 text-red-600" aria-label="Inválido" />;
			}

			return null;
		};

		const validationIcon = renderValidationIcon();

		return (
			<div className="relative">
				<Input
					ref={ref}
					className={cn(
						// Adicionar padding à direita quando há ícone
						validationIcon && "pr-10",
						// Classes de estado
						showSuccess && "border-green-500 focus-visible:ring-green-500",
						showError && "border-red-500 focus-visible:ring-red-500",
						className,
					)}
					aria-invalid={showError}
					{...props}
				/>

				{/* Ícone de validação */}
				{validationIcon && (
					<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						{validationIcon}
					</div>
				)}
			</div>
		);
	},
);

InputWithValidation.displayName = "InputWithValidation";

export { InputWithValidation };
