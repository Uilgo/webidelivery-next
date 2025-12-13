import { ModeToggle } from "@/components/ui/mode-toggle";

interface AuthProps {
	children: React.ReactNode;
}

/**
 * Layout para páginas de autenticação
 * Inclui toggle de tema no canto superior direito
 */
export function Auth({ children }: AuthProps) {
	return (
		<div className="min-h-screen bg-muted/30 relative">
			{/* Toggle de tema no canto superior direito */}
			<div className="absolute top-4 right-4 z-10">
				<ModeToggle />
			</div>

			{/* Conteúdo principal centralizado */}
			<div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
				{children}
			</div>
		</div>
	);
}
