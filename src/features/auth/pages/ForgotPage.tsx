import { ForgotForm } from "@/features/auth/components/ForgotForm";
import { Auth } from "@/layouts/Auth";

/**
 * Página de recuperação de senha
 * Renderiza o formulário de reset de senha com fluxo completo
 */
export function ForgotPage() {
	return (
		<Auth>
			<ForgotForm />
		</Auth>
	);
}
