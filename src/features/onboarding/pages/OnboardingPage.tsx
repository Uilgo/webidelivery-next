"use client";

import { Stepper } from "@/components/ui/stepper";
import { useOnboarding } from "@/hooks/core/useOnboarding";
import { OnboardingForm } from "../components/OnboardingForm";

/**
 * Página principal do onboarding
 * Layout em 2 colunas: Stepper + Progresso (esquerda) + Formulário (direita)
 * Usa 100svh para evitar scroll
 */
export function OnboardingPage() {
	const { steps, progress, isHydrated } = useOnboarding();

	// Aguarda hidratação para evitar mismatch de SSR
	if (!isHydrated) {
		return (
			<div className="h-svh flex items-center justify-center">
				<div className="animate-pulse text-muted-foreground">Carregando...</div>
			</div>
		);
	}

	return (
		<div className="h-svh flex flex-col overflow-hidden">
			{/* Header fixo */}
			<div className="shrink-0 px-6 py-4 border-b bg-background/95 backdrop-blur">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Configuração Inicial</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Vamos configurar sua empresa em poucos passos
					</p>
				</div>
			</div>

			{/* Layout Principal - 2 Colunas */}
			<div className="flex-1 flex overflow-hidden">
				{/* Coluna Esquerda - Stepper + Progresso */}
				<div className="w-80 shrink-0 border-r bg-card/50 p-6 flex flex-col">
					{/* Stepper */}
					<div className="flex-1 flex flex-col justify-center">
						<h2 className="text-lg font-semibold mb-8 text-center">Etapas</h2>
						<Stepper steps={steps} className="flex-1 justify-center" />
					</div>

					{/* Barra de Progresso */}
					<div className="shrink-0 mt-8">
						<div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
							<span>Progresso</span>
							<span className="font-medium">{Math.round(progress)}%</span>
						</div>
						<div className="h-2 bg-muted rounded-full overflow-hidden">
							<div
								className="h-full bg-primary transition-all duration-500 ease-out"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				</div>

				{/* Coluna Direita - Formulário (centralizado) */}
				<div className="flex-1 overflow-auto">
					<div className="h-full p-6 flex items-start justify-center">
						<OnboardingForm />
					</div>
				</div>
			</div>
		</div>
	);
}
