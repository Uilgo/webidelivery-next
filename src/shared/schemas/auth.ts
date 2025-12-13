import { z } from "zod";
import type { PerfilInsert } from "@/shared/types/tables/perfis";

/**
 * Schemas de validação para autenticação
 * Usando Zod para validação client-side e server-side
 * Integrado com tipos do banco de dados
 */

// Schemas auxiliares (declarados primeiro para serem reutilizados)
export const emailSchema = z
	.string()
	.min(1, "E-mail é obrigatório")
	.refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
		message: "E-mail inválido",
	});

export const passwordSchema = z
	.string()
	.min(8, "Senha deve ter pelo menos 8 caracteres")
	.regex(/[a-zA-Z]/, "Senha deve conter pelo menos 1 letra")
	.regex(/\d/, "Senha deve conter pelo menos 1 número")
	.regex(/[!@#$%^&*(),.?":{}|<>]/, "Senha deve conter pelo menos 1 caractere especial");

export const nameSchema = z
	.string()
	.min(1, "Campo é obrigatório")
	.min(2, "Deve ter pelo menos 2 caracteres")
	.max(50, "Deve ter no máximo 50 caracteres")
	.trim();

// Schema para login
export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Senha é obrigatória"),
});

// Schema para cadastro
export const signupSchema = z
	.object({
		nome: nameSchema,
		sobrenome: nameSchema,
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

// Schema para recuperação de senha
export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

// Schema para redefinir senha
export const resetPasswordSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

// Tipos TypeScript derivados dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Tipo para dados processados do signup (compatível com PerfilInsert)
export type SignupProcessedData = Pick<PerfilInsert, "nome" | "sobrenome" | "email"> & {
	password: string;
};

// Schema para validar dados que serão inseridos na tabela perfis
export const perfilInsertSchema = z.object({
	id: z
		.string()
		.refine(
			(val) =>
				/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val),
			{
				message: "ID deve ser um UUID válido",
			},
		),
	nome: nameSchema,
	sobrenome: nameSchema,
	email: emailSchema,
	cargo: z.enum(["admin", "gerente", "staff", "entregador"]).default("admin"),
	onboarding: z.boolean().default(false),
	estabelecimento_id: z
		.string()
		.refine(
			(val) =>
				/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val),
			{
				message: "ID do estabelecimento deve ser um UUID válido",
			},
		)
		.nullable()
		.default(null),
	avatar_url: z
		.string()
		.refine(
			(val) => {
				try {
					new URL(val);
					return true;
				} catch {
					return false;
				}
			},
			{
				message: "URL do avatar inválida",
			},
		)
		.nullable()
		.optional(),
});

export type PerfilInsertValidated = z.infer<typeof perfilInsertSchema>;

// Utilitários para validação
export const validateEmail = (email: string) => {
	const result = emailSchema.safeParse(email);
	return result.success ? null : result.error.issues[0]?.message;
};

export const validatePassword = (password: string) => {
	const result = passwordSchema.safeParse(password);
	return result.success ? null : result.error.issues[0]?.message;
};

export const validateName = (name: string) => {
	const result = nameSchema.safeParse(name);
	return result.success ? null : result.error.issues[0]?.message;
};
