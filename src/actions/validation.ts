"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Server Action para verificar se email já está em uso
 * Usa função RPC que contorna RLS com SECURITY DEFINER
 */
export async function checkEmailAvailability(email: string) {
	try {
		// Validar formato básico do email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return {
				available: false,
				email,
				error: "Formato de email inválido",
			};
		}

		const supabase = await createClient();
		const normalizedEmail = email.toLowerCase().trim();

		// Usar função RPC que contorna RLS
		const { data: emailExists, error } = await supabase.rpc("fn_global_verificar_email_existe", {
			p_email: normalizedEmail,
		});

		if (error) {
			console.error("Erro na função RPC:", error);
			return {
				available: false,
				email: normalizedEmail,
				error: "Erro ao verificar disponibilidade",
			};
		}

		const isAvailable = !emailExists;

		return {
			available: isAvailable,
			email: normalizedEmail,
		};
	} catch (error) {
		console.error("Erro ao verificar email:", error);
		return {
			available: false,
			email,
			error: "Erro ao verificar disponibilidade",
		};
	}
}

/**
 * Server Action para verificar disponibilidade de slug
 * Mantém validação em tempo real para UX, mas a validação final é na RPC
 */
export async function checkSlugAvailability(slug: string) {
	try {
		// Validar formato do slug
		const slugRegex = /^[a-z0-9][a-z0-9-]*$/;
		if (!slugRegex.test(slug) || slug.length < 3 || slug.length > 40) {
			return {
				available: false,
				slug,
				error: "Formato de slug inválido",
			};
		}

		// Verificar slugs reservados
		const reservedSlugs = [
			"webidelivery",
			"api",
			"admin",
			"dashboard",
			"settings",
			"auth",
			"login",
			"signup",
			"onboarding",
			"super-admin",
			"www",
			"mail",
			"ftp",
			"blog",
			"shop",
			"store",
			"app",
			"mobile",
		];

		if (reservedSlugs.includes(slug)) {
			return {
				available: false,
				slug,
				error: "Este slug é reservado pelo sistema",
			};
		}

		const supabase = await createClient();

		// Usar função RPC que contorna RLS
		const { data: slugExists, error } = await supabase.rpc("fn_global_verificar_slug_existe", {
			p_slug: slug,
		});

		if (error) {
			console.error("Erro na função RPC:", error);
			return {
				available: false,
				slug,
				error: "Erro ao verificar disponibilidade",
			};
		}

		const isAvailable = !slugExists;

		return {
			available: isAvailable,
			slug,
		};
	} catch (error) {
		console.error("Erro ao verificar slug:", error);
		return {
			available: false,
			slug,
			error: "Erro ao verificar disponibilidade",
		};
	}
}
