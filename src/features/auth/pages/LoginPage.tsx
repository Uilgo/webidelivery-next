import { LoginForm } from "@/features/auth/components/LoginForm";
import { Auth } from "@/layouts/Auth";

/**
 * Página de login para estabelecimentos
 * Renderiza o formulário de login com layout completo
 */
export function LoginPage() {
	return (
		<Auth>
			<LoginForm />
		</Auth>
	);
}
