import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";

interface AuthProps {
	children: React.ReactNode;
	fullScreen?: boolean; // Para páginas como onboarding que ocupam tela toda
}

/**
 * Layout para páginas de autenticação
 * Inclui toggle de tema no canto superior direito
 */
export function Auth({ children, fullScreen = false }: AuthProps) {
	return (
		<div className={cn("bg-muted/30 relative", fullScreen ? "h-svh" : "min-h-screen")}>
			{/* Toggle de tema no canto superior direito */}
			<div className="absolute top-4 right-4 z-20">
				<ModeToggle />
			</div>

			{/* Conteúdo principal */}
			{fullScreen ? (
				// Para onboarding - ocupa tela toda sem scroll
				<div className="h-full">{children}</div>
			) : (
				// Para login/signup - centralizado
				<div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
					{children}
				</div>
			)}
		</div>
	);
}
