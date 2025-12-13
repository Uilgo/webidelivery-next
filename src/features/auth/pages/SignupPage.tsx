import { SignupForm } from "@/features/auth/components/SignupForm";
import { Auth } from "@/layouts/Auth";

/**
 * Página de cadastro para estabelecimentos
 * Renderiza o formulário de cadastro com validações completas
 */
export function SignupPage() {
	return (
		<Auth>
			<SignupForm />
		</Auth>
	);
}
