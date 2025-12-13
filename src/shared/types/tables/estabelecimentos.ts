/**
 * Tipos da tabela 'estabelecimentos'
 * Representa os estabelecimentos/lojas do sistema
 */

import type { Json } from "../database";

// Tipo principal da tabela estabelecimentos
export interface Estabelecimento {
	readonly id: string;
	readonly created_at: string;
	readonly updated_at: string;
	readonly nome: string;
	readonly slug: string;
	readonly descricao: string | null;
	readonly logo_url: string | null;
	readonly logo_url_dark: string | null;
	readonly capa_url: string | null;
	readonly foto_capa_url: string | null;
	readonly whatsapp: string;
	readonly aberto: boolean;
	readonly cor_fundo: string | null;
	readonly endereco_estado: string;
	readonly endereco_cidade: string;
	readonly endereco_bairro: string;
	readonly endereco_rua: string;
	readonly endereco_numero: string;
	readonly endereco_cep: string | null;
	readonly endereco_complemento: string | null;
	readonly endereco_referencia: string | null;
	readonly config_geral: Json;
	readonly config_pagamento: Json;
	readonly config_tema: Json;
}

// Tipo para inserção (INSERT)
export interface EstabelecimentoInsert {
	nome: string;
	slug: string;
	descricao?: string | null;
	logo_url?: string | null;
	logo_url_dark?: string | null;
	capa_url?: string | null;
	foto_capa_url?: string | null;
	whatsapp: string;
	aberto?: boolean;
	cor_fundo?: string | null;
	endereco_estado: string;
	endereco_cidade: string;
	endereco_bairro: string;
	endereco_rua: string;
	endereco_numero: string;
	endereco_cep?: string | null;
	endereco_complemento?: string | null;
	endereco_referencia?: string | null;
	config_geral?: Json;
	config_pagamento?: Json;
	config_tema?: Json;
}

// Tipo para atualização (UPDATE)
export interface EstabelecimentoUpdate {
	nome?: string;
	slug?: string;
	descricao?: string | null;
	logo_url?: string | null;
	logo_url_dark?: string | null;
	capa_url?: string | null;
	foto_capa_url?: string | null;
	whatsapp?: string;
	aberto?: boolean;
	cor_fundo?: string | null;
	endereco_estado?: string;
	endereco_cidade?: string;
	endereco_bairro?: string;
	endereco_rua?: string;
	endereco_numero?: string;
	endereco_cep?: string | null;
	endereco_complemento?: string | null;
	endereco_referencia?: string | null;
	config_geral?: Json;
	config_pagamento?: Json;
	config_tema?: Json;
}

// Tipos para formulários
export interface EstabelecimentoFormData {
	nome: string;
	descricao?: string | null;
	whatsapp: string;
	endereco_estado: string;
	endereco_cidade: string;
	endereco_bairro: string;
	endereco_rua: string;
	endereco_numero: string;
	endereco_cep?: string | null;
	endereco_complemento?: string | null;
	endereco_referencia?: string | null;
}

// Type guard para validação
export const isEstabelecimento = (data: unknown): data is Estabelecimento => {
	return (
		typeof data === "object" &&
		data !== null &&
		"id" in data &&
		"nome" in data &&
		"slug" in data &&
		typeof (data as Record<string, unknown>).id === "string" &&
		typeof (data as Record<string, unknown>).nome === "string" &&
		typeof (data as Record<string, unknown>).slug === "string"
	);
};
