"use client";

import { Building2, Check, CheckCircle, MapPin, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Componente Stepper para navegação em etapas
 * Com ícones específicos para cada etapa do onboarding
 */

export interface StepperStep {
	id: string;
	title: string;
	description?: string;
	completed?: boolean;
	current?: boolean;
}

interface StepperProps {
	steps: StepperStep[];
	className?: string;
}

// Mapeamento de ícones por ID do step
const stepIcons = {
	empresa: Building2,
	endereco: MapPin,
	personalizacao: Palette,
	revisao: CheckCircle,
};

function StepItem({ step, isLast }: { step: StepperStep; index: number; isLast: boolean }) {
	// Obter ícone do step
	const IconComponent = stepIcons[step.id as keyof typeof stepIcons] || Building2;

	// Determinar classes do círculo
	const getCircleClasses = () => {
		if (step.completed) {
			return "border-primary bg-primary text-primary-foreground";
		}
		if (step.current) {
			return "border-primary bg-background text-primary ring-4 ring-primary/20";
		}
		return "border-muted-foreground/30 bg-background text-muted-foreground";
	};

	return (
		<div className="relative">
			{/* Layout horizontal: Círculo + Texto */}
			<div className="flex items-center gap-4">
				{/* Círculo com ícone */}
				<div
					className={cn(
						"flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 shrink-0 relative z-10",
						getCircleClasses(),
					)}
				>
					{step.completed ? <Check className="h-5 w-5" /> : <IconComponent className="h-5 w-5" />}
				</div>

				{/* Conteúdo do Step - ao lado direito */}
				<div className="flex-1">
					<h3
						className={cn(
							"text-sm font-medium leading-tight",
							step.current ? "text-foreground" : "text-muted-foreground",
						)}
					>
						{step.title}
					</h3>
					{step.description && (
						<p className="mt-1 text-xs text-muted-foreground leading-tight">{step.description}</p>
					)}
				</div>
			</div>

			{/* Linha conectora vertical - ALTURA CORRIGIDA PARA CONECTAR */}
			{!isLast && (
				<div
					className={cn(
						"absolute left-6 top-12 w-0.5 h-[68px] transition-colors duration-200 -translate-x-0.5",
						step.completed ? "bg-primary" : "bg-muted-foreground/30",
					)}
				/>
			)}
		</div>
	);
}

export function Stepper({ steps, className }: StepperProps) {
	return (
		<nav
			aria-label="Progresso do onboarding"
			className={cn("flex flex-col space-y-[44px]", className)}
		>
			{steps.map((step, index) => (
				<StepItem key={step.id} step={step} index={index} isLast={index === steps.length - 1} />
			))}
		</nav>
	);
}
