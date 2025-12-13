import { z } from "zod";
import type { EstabelecimentoInsert } from "@/shared/types/tables/estabelecimentos";

/**
 * Schemas de validação para onboarding
 * Baseado nos tipos do banco de dados (EstabelecimentoInsert)
 * Conforme especificado no PRD
 */

// Schema para validação de slug
export const slugSchema = z
	.string()
	.min(3, "Slug deve ter pelo menos 3 caracteres")
	.max(40, "Slug deve ter no máximo 40 caracteres")
	.regex(
		/^[a-z0-9][a-z0-9-]*$/,
		"Slug deve iniciar com letra ou número e conter apenas letras minúsculas, números e hífens",
	)
	.refine((val) => !val.endsWith("-"), "Slug não pode terminar com hífen")
	.refine((val) => !val.includes("--"), "Slug não pode ter hífens duplos")
	.refine((val) => {
		const reservedSlugs = ["api", "admin", "dashboard", "settings", "auth"];
		return !reservedSlugs.includes(val);
	}, "Este slug é reservado pelo sistema");

// Schema baseado na estrutura do banco (EstabelecimentoInsert)
export const onboardingSchema = z.object({
	// Dados básicos da empresa
	nome: z
		.string()
		.min(1, "Nome da empresa é obrigatório")
		.min(2, "Nome deve ter pelo menos 2 caracteres")
		.max(100, "Nome deve ter no máximo 100 caracteres")
		.trim(),

	descricao: z
		.string()
		.max(500, "Descrição deve ter no máximo 500 caracteres")
		.optional()
		.nullable(),

	whatsapp: z
		.string()
		.min(1, "WhatsApp é obrigatório")
		.regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato inválido. Use: (11) 99999-9999"),

	// Endereço (seguindo estrutura do banco)
	endereco_estado: z
		.string()
		.min(1, "Estado é obrigatório")
		.length(2, "Estado deve ter 2 caracteres"),

	endereco_cidade: z
		.string()
		.min(1, "Cidade é obrigatória")
		.min(2, "Cidade deve ter pelo menos 2 caracteres")
		.max(100, "Cidade deve ter no máximo 100 caracteres")
		.trim(),

	endereco_bairro: z
		.string()
		.min(1, "Bairro é obrigatório")
		.min(2, "Bairro deve ter pelo menos 2 caracteres")
		.max(100, "Bairro deve ter no máximo 100 caracteres")
		.trim(),

	endereco_rua: z
		.string()
		.min(1, "Rua é obrigatória")
		.min(5, "Rua deve ter pelo menos 5 caracteres")
		.max(200, "Rua deve ter no máximo 200 caracteres")
		.trim(),

	endereco_numero: z
		.string()
		.min(1, "Número é obrigatório")
		.max(20, "Número deve ter no máximo 20 caracteres")
		.trim(),

	endereco_cep: z
		.string()
		.regex(/^\d{5}-?\d{3}$/, "CEP inválido. Use: 12345-678")
		.optional()
		.nullable(),

	endereco_complemento: z
		.string()
		.max(100, "Complemento deve ter no máximo 100 caracteres")
		.optional()
		.nullable(),

	endereco_referencia: z
		.string()
		.max(200, "Ponto de referência deve ter no máximo 200 caracteres")
		.optional()
		.nullable(),

	// URL personalizada
	slug: slugSchema,

	// Logo (opcional)
	logo_url: z.string().url("URL da logo inválida").optional().nullable(),
});

// Tipos TypeScript derivados do schema
export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Type guard para verificar se os dados são compatíveis com EstabelecimentoInsert
export const isValidEstabelecimentoData = (
	data: OnboardingFormData,
): data is EstabelecimentoInsert => {
	return (
		typeof data.nome === "string" &&
		typeof data.slug === "string" &&
		typeof data.whatsapp === "string" &&
		typeof data.endereco_estado === "string" &&
		typeof data.endereco_cidade === "string" &&
		typeof data.endereco_bairro === "string" &&
		typeof data.endereco_rua === "string" &&
		typeof data.endereco_numero === "string"
	);
};

// Função para converter dados do onboarding para EstabelecimentoInsert
export const toEstabelecimentoInsert = (data: OnboardingFormData): EstabelecimentoInsert => {
	return {
		nome: data.nome,
		slug: data.slug,
		descricao: data.descricao || null,
		whatsapp: data.whatsapp,
		endereco_estado: data.endereco_estado,
		endereco_cidade: data.endereco_cidade,
		endereco_bairro: data.endereco_bairro,
		endereco_rua: data.endereco_rua,
		endereco_numero: data.endereco_numero,
		endereco_cep: data.endereco_cep || null,
		endereco_complemento: data.endereco_complemento || null,
		endereco_referencia: data.endereco_referencia || null,
		logo_url: data.logo_url || null,
		// Valores padrão
		aberto: false, // Estabelecimento inicia fechado
		config_geral: {},
		config_pagamento: {},
		config_tema: {},
	};
};

// Schema para validação de disponibilidade de slug
export const slugAvailabilitySchema = z.object({
	slug: slugSchema,
	available: z.boolean(),
});

export type SlugAvailabilityData = z.infer<typeof slugAvailabilitySchema>;

// Utilitários de validação
export const validateSlug = (slug: string) => {
	const result = slugSchema.safeParse(slug);
	return result.success ? null : result.error.issues[0]?.message;
};

export const validateWhatsApp = (phone: string) => {
	const phoneSchema = z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato inválido");
	const result = phoneSchema.safeParse(phone);
	return result.success ? null : result.error.issues[0]?.message;
};

export const validateCEP = (cep: string) => {
	if (!cep) return null; // CEP é opcional
	const cepSchema = z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido");
	const result = cepSchema.safeParse(cep);
	return result.success ? null : result.error.issues[0]?.message;
};
