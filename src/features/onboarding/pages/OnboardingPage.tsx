"use client";

import { Stepper } from "@/components/ui/stepper";
import { useOnboarding } from "@/hooks/core/useOnboarding";
import { OnboardingForm } from "../components/OnboardingForm";

/**
 * Página principal do onboarding
 * Layout em 2 colunas: Stepper (esquerda) + Formulário (direita)
 */
export function OnboardingPage() {
	const { steps, progress } = useOnboarding();

	return (
		<div className="min-h-screen bg-muted/30 p-6">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold">Configuração Inicial</h1>
					<p className="text-muted-foreground mt-2">
						Vamos configurar sua empresa em poucos passos
					</p>
				</div>

				{/* Barra de Progresso */}
				<div className="mb-8">
					<div className="mx-auto max-w-md">
						<div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
							<span>Progresso</span>
							<span>{Math.round(progress)}%</span>
						</div>
						<div className="h-2 bg-muted rounded-full overflow-hidden">
							<div
								className="h-full bg-primary transition-all duration-300 ease-out"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				</div>

				{/* Layout Principal - 2 Colunas */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Coluna Esquerda - Stepper */}
					<div className="lg:col-span-4">
						<div className="sticky top-6">
							<div className="rounded-lg border bg-card p-6">
								<h2 className="text-lg font-semibold mb-6">Etapas</h2>
								<Stepper steps={steps} orientation="vertical" className="space-y-6" />
							</div>
						</div>
					</div>

					{/* Coluna Direita - Formulário */}
					<div className="lg:col-span-8">
						<div className="rounded-lg border bg-card p-6">
							<OnboardingForm />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
