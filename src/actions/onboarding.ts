"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkSlugAvailability } from "@/actions/validation";
import { type OnboardingFormData, onboardingSchema } from "@/shared/schemas/onboarding";
import { createClient } from "@/utils/supabase/server";

/**
 * Valida autenticação do usuário
 */
async function validateUserAuth(supabase: Awaited<ReturnType<typeof createClient>>) {
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	return user;
}

/**
 * Valida disponibilidade do slug
 */
async function validateSlugAvailability(slug: string) {
	const slugValidation = await checkSlugAvailability(slug);

	if (!slugValidation.available) {
		throw new Error(slugValidation.error || "Este slug já está em uso");
	}
}

/**
 * Cria estabelecimento via RPC
 */
async function createEstabelecimento(
	supabase: Awaited<ReturnType<typeof createClient>>,
	validatedData: OnboardingFormData,
) {
	const { data: estabelecimentoId, error: rpcError } = await supabase.rpc(
		"fn_onboarding_criar_estabelecimento",
		{
			p_nome: validatedData.nome,
			p_slug: validatedData.slug,
			p_whatsapp: validatedData.whatsapp,
			p_endereco_rua: validatedData.endereco_rua,
			p_endereco_numero: validatedData.endereco_numero,
			p_endereco_bairro: validatedData.endereco_bairro,
			p_endereco_cidade: validatedData.endereco_cidade,
			p_endereco_estado: validatedData.endereco_estado,
			p_descricao: validatedData.descricao || null,
			p_logo_url: null, // Logo será adicionado posteriormente
			p_logo_url_dark: null, // Logo dark será adicionado posteriormente
			p_endereco_cep: validatedData.endereco_cep || null,
			p_endereco_complemento: validatedData.endereco_complemento || null,
			p_endereco_referencia: validatedData.endereco_referencia || null,
		},
	);

	if (rpcError) {
		console.error("Erro na função RPC:", rpcError);
		throw handleRpcError(rpcError);
	}

	if (!estabelecimentoId) {
		throw new Error("Erro ao criar estabelecimento - ID não retornado");
	}

	console.log(`✅ Estabelecimento criado com ID: ${estabelecimentoId}`);
	return estabelecimentoId;
}

/**
 * Trata erros específicos da RPC
 */
function handleRpcError(rpcError: { message?: string }): Error {
	if (rpcError.message?.includes("slug")) {
		return new Error("Este slug já está em uso");
	}
	if (rpcError.message?.includes("onboarding")) {
		return new Error("Onboarding já foi concluído");
	}
	if (rpcError.message?.includes("autenticado")) {
		return new Error("Usuário não autenticado");
	}

	return new Error("Erro ao criar estabelecimento");
}

/**
 * Marca onboarding como completo no perfil do usuário
 */
async function markOnboardingComplete(
	supabase: Awaited<ReturnType<typeof createClient>>,
	userId: string,
) {
	const { error } = await supabase.from("perfis").update({ onboarding: true }).eq("id", userId);

	if (error) {
		console.error("Erro ao marcar onboarding como completo:", error);
		throw new Error("Erro ao finalizar onboarding");
	}

	console.log("✅ Onboarding marcado como completo");
}

/**
 * Server Action para finalizar onboarding
 * Cria estabelecimento e atualiza perfil do usuário
 */
export async function completeOnboarding(formData: OnboardingFormData) {
	try {
		// Validar dados com Zod
		const validatedData = onboardingSchema.parse(formData);

		// Criar cliente Supabase
		const supabase = await createClient();

		// Validar autenticação
		const user = await validateUserAuth(supabase);

		// Validar slug
		await validateSlugAvailability(validatedData.slug);

		// Criar estabelecimento
		await createEstabelecimento(supabase, validatedData);

		// IMPORTANTE: Marcar onboarding como completo (conforme PRD)
		await markOnboardingComplete(supabase, user.id);

		// Revalidar cache e redirecionar para dashboard (conforme PRD)
		revalidatePath("/", "layout");
		redirect("/admin/dashboard");
	} catch (error) {
		console.error("Erro no onboarding:", error);

		if (error instanceof Error) {
			throw error;
		}

		throw new Error("Erro interno do servidor");
	}
}
