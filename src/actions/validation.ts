"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Server Action para verificar se email já está em uso
 * Usa função RPC que contorna RLS com SECURITY DEFINER
 */
export async function checkEmailAvailability(email: string) {
	try {
		console.log(`🔍 Verificando disponibilidade do email: "${email}"`);

		// Validar formato básico do email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			console.log(`❌ Email com formato inválido: "${email}"`);
			return {
				available: false,
				email,
				error: "Formato de email inválido",
			};
		}

		const supabase = await createClient();
		const normalizedEmail = email.toLowerCase().trim();

		console.log(`🔍 Chamando função RPC para email: "${normalizedEmail}"`);

		// Usar função RPC que contorna RLS
		const { data: emailExists, error } = await supabase.rpc("fn_global_verificar_email_existe", {
			p_email: normalizedEmail,
		});

		console.log(`📊 Resultado da função RPC:`, { emailExists, error });

		if (error) {
			console.error(`❌ Erro na função RPC:`, error);
			return {
				available: false,
				email: normalizedEmail,
				error: "Erro ao verificar disponibilidade",
			};
		}

		const isAvailable = !emailExists;
		console.log(`✅ Email "${normalizedEmail}" ${isAvailable ? "DISPONÍVEL" : "JÁ EXISTE"}`);

		return {
			available: isAvailable,
			email: normalizedEmail,
		};
	} catch (error) {
		console.error("❌ Erro ao verificar email:", error);
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
		console.log(`🔍 Verificando disponibilidade do slug: "${slug}"`);

		// Validar formato do slug
		const slugRegex = /^[a-z0-9][a-z0-9-]*$/;
		if (!slugRegex.test(slug) || slug.length < 3 || slug.length > 40) {
			console.log(`❌ Slug com formato inválido: "${slug}"`);
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
			console.log(`❌ Slug reservado: "${slug}"`);
			return {
				available: false,
				slug,
				error: "Este slug é reservado pelo sistema",
			};
		}

		const supabase = await createClient();

		console.log(`🔍 Chamando função RPC para slug: "${slug}"`);

		// Usar função RPC que contorna RLS
		const { data: slugExists, error } = await supabase.rpc("fn_global_verificar_slug_existe", {
			p_slug: slug,
		});

		console.log(`📊 Resultado da função RPC:`, { slugExists, error });

		if (error) {
			console.error(`❌ Erro na função RPC:`, error);
			return {
				available: false,
				slug,
				error: "Erro ao verificar disponibilidade",
			};
		}

		const isAvailable = !slugExists;
		console.log(`✅ Slug "${slug}" ${isAvailable ? "DISPONÍVEL" : "JÁ EXISTE"}`);

		return {
			available: isAvailable,
			slug,
		};
	} catch (error) {
		console.error("❌ Erro ao verificar slug:", error);
		return {
			available: false,
			slug,
			error: "Erro ao verificar disponibilidade",
		};
	}
}
