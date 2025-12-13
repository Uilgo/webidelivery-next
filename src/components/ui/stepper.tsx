"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Componente Stepper para navegação em etapas
 * Suporta orientação vertical e horizontal
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
	orientation?: "horizontal" | "vertical";
	className?: string;
}

interface StepItemProps {
	step: StepperStep;
	index: number;
	isLast: boolean;
	isVertical: boolean;
}

function StepItem({ step, index, isLast, isVertical }: StepItemProps) {
	// Determinar classes do indicador
	const getIndicatorClasses = () => {
		if (step.completed) {
			return "border-primary bg-primary text-primary-foreground";
		}
		if (step.current) {
			return "border-primary bg-background text-primary";
		}
		return "border-muted-foreground/30 bg-background text-muted-foreground";
	};

	// Determinar classes da linha conectora
	const getConnectorClasses = () => {
		if (isVertical) {
			return cn(
				"ml-4 w-8 h-px transition-colors",
				step.completed ? "bg-primary" : "bg-muted-foreground/30",
			);
		}
		return cn(
			"mt-4 w-px h-8 transition-colors",
			step.completed ? "bg-primary" : "bg-muted-foreground/30",
		);
	};

	return (
		<div className={cn("flex", isVertical ? "flex-row items-start" : "flex-col items-center")}>
			{/* Indicador do Step */}
			<div className="flex items-center">
				<div
					className={cn(
						"flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
						getIndicatorClasses(),
					)}
				>
					{step.completed ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
				</div>

				{/* Linha conectora */}
				{!isLast && <div className={getConnectorClasses()} />}
			</div>

			{/* Conteúdo do Step */}
			<div className={cn("flex-1", isVertical ? "ml-4" : "mt-2 text-center")}>
				<h3
					className={cn(
						"text-sm font-medium",
						step.current ? "text-foreground" : "text-muted-foreground",
					)}
				>
					{step.title}
				</h3>
				{step.description && (
					<p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
				)}
			</div>
		</div>
	);
}

export function Stepper({ steps, orientation = "vertical", className }: StepperProps) {
	const isVertical = orientation === "vertical";

	return (
		<nav
			aria-label="Progresso do onboarding"
			className={cn("flex", isVertical ? "flex-col space-y-4" : "flex-row space-x-4", className)}
		>
			{steps.map((step, index) => (
				<StepItem
					key={step.id}
					step={step}
					index={index}
					isLast={index === steps.length - 1}
					isVertical={isVertical}
				/>
			))}
		</nav>
	);
}
