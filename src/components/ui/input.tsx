"use client";

import {
	Building,
	Calendar,
	Clock,
	Eye,
	EyeOff,
	Hash,
	Lock,
	Mail,
	MapPin,
	Phone,
	User,
} from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
	icon?: React.ReactNode;
}

// Função auxiliar para detectar ícone baseado no nome/tipo do campo
function detectIcon(name: string, placeholder: string, type?: string): React.ReactNode {
	const lowerName = name.toLowerCase();
	const lowerPlaceholder = placeholder.toLowerCase();

	// Ícone específico para senha
	if (type === "password") {
		return <Lock className="h-4 w-4" />;
	}

	if (lowerName.includes("email") || lowerPlaceholder.includes("email")) {
		return <Mail className="h-4 w-4" />;
	}
	if (lowerName.includes("nome") || lowerName.includes("name")) {
		return <User className="h-4 w-4" />;
	}
	if (
		lowerName.includes("telefone") ||
		lowerName.includes("phone") ||
		lowerName.includes("whatsapp")
	) {
		return <Phone className="h-4 w-4" />;
	}
	if (
		lowerName.includes("endereco") ||
		lowerName.includes("address") ||
		lowerName.includes("rua")
	) {
		return <MapPin className="h-4 w-4" />;
	}
	if (
		lowerName.includes("empresa") ||
		lowerName.includes("company") ||
		lowerName.includes("estabelecimento")
	) {
		return <Building className="h-4 w-4" />;
	}
	if (lowerName.includes("cep") || lowerName.includes("codigo") || lowerName.includes("numero")) {
		return <Hash className="h-4 w-4" />;
	}
	if (type === "date") return <Calendar className="h-4 w-4" />;
	if (type === "time") return <Clock className="h-4 w-4" />;

	return null;
}

function Input({ className, type, icon, ...props }: InputProps) {
	const [showPassword, setShowPassword] = useState(false);

	// Obter ícone automático
	const autoIcon = icon || detectIcon(props.name || "", props.placeholder || "", type);

	// Se for input de senha, renderizar com ícone à esquerda e toggle à direita
	if (type === "password") {
		return (
			<div className="relative">
				{/* Ícone à esquerda */}
				{autoIcon && (
					<div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
						{autoIcon}
					</div>
				)}

				<input
					type={showPassword ? "text" : "password"}
					data-slot="input"
					className={cn(
						"dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-md border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 pr-10",
						autoIcon ? "pl-9" : "pl-2.5",
						className,
					)}
					{...props}
				/>

				{/* Toggle de senha à direita */}
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
					onClick={() => setShowPassword(!showPassword)}
					disabled={props.disabled}
				>
					{showPassword ? (
						<EyeOff className="h-4 w-4 text-muted-foreground" />
					) : (
						<Eye className="h-4 w-4 text-muted-foreground" />
					)}
					<span className="sr-only">{showPassword ? "Ocultar senha" : "Mostrar senha"}</span>
				</Button>
			</div>
		);
	}

	// Input normal com ícone à esquerda (se houver)
	if (autoIcon) {
		return (
			<div className="relative">
				{/* Ícone à esquerda */}
				<div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
					{autoIcon}
				</div>

				<input
					type={type}
					data-slot="input"
					className={cn(
						"dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-md border bg-transparent pl-9 pr-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					{...props}
				/>
			</div>
		);
	}

	// Input sem ícone
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
