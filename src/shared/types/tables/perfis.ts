/**
 * Tipos da tabela 'perfis'
 * Representa os usuários do sistema e seus perfis
 */

// Enums específicos da tabela perfis
export type CargoUsuario = "admin" | "gerente" | "staff" | "entregador";

// Tipo principal da tabela perfis
export interface Perfil {
	readonly id: string;
	readonly created_at: string;
	readonly updated_at: string;
	readonly estabelecimento_id: string | null;
	readonly cargo: CargoUsuario;
	readonly nome: string;
	readonly sobrenome: string;
	readonly avatar_url: string | null;
	readonly email: string;
	readonly onboarding: boolean;
}

// Tipo para inserção (INSERT)
export interface PerfilInsert {
	id: string;
	estabelecimento_id?: string | null;
	cargo?: CargoUsuario;
	nome: string;
	sobrenome: string;
	avatar_url?: string | null;
	email: string;
	onboarding?: boolean;
}

// Tipo para atualização (UPDATE)
export interface PerfilUpdate {
	estabelecimento_id?: string | null;
	cargo?: CargoUsuario;
	nome?: string;
	sobrenome?: string;
	avatar_url?: string | null;
	email?: string;
	onboarding?: boolean;
}

// Tipos derivados para uso na aplicação
export interface PerfilCompleto extends Perfil {
	estabelecimento?: import("./estabelecimentos").Estabelecimento | null;
}

// Tipos para formulários
export interface PerfilFormData {
	nome: string;
	sobrenome: string;
	avatar_url?: string | null;
}

// Type guard para validação
export const isPerfil = (data: unknown): data is Perfil => {
	return (
		typeof data === "object" &&
		data !== null &&
		"id" in data &&
		"nome" in data &&
		"sobrenome" in data &&
		"email" in data &&
		"cargo" in data &&
		typeof (data as Record<string, unknown>).id === "string" &&
		typeof (data as Record<string, unknown>).nome === "string" &&
		typeof (data as Record<string, unknown>).sobrenome === "string" &&
		typeof (data as Record<string, unknown>).email === "string"
	);
};
