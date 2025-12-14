"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PerfilInsert } from "@/shared/types/tables/perfis";
import { createClient } from "@/utils/supabase/server";

/**
 * Server Action para fazer login do usuário
 * Processa dados do formulário e autentica via Supabase
 */
export async function login(formData: FormData) {
	const supabase = await createClient();

	// Extrai e valida dados do formulário
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	// Validação básica server-side
	if (!email || !password) {
		console.error("Login: Dados obrigatórios não fornecidos");
		redirect("/login?error=missing-data");
	}

	// Tenta fazer login no Supabase
	const { data, error } = await supabase.auth.signInWithPassword({
		email: email.trim().toLowerCase(),
		password,
	});

	if (error) {
		console.error("Erro no login:", error.message);

		// Redireciona com erro específico
		if (error.message.includes("Invalid login credentials")) {
			redirect("/login?error=invalid-credentials");
		}

		redirect("/login?error=auth-error");
	}

	if (!data.user) {
		console.error("Login: Usuário não retornado após autenticação");
		redirect("/login?error=no-user");
	}

	// Login bem-sucedido - revalida cache e redireciona para página raiz
	// A página raiz (/) fará a lógica de verificar onboarding conforme PRD
	revalidatePath("/", "layout");
	redirect("/");
}

/**
 * Server Action para cadastrar novo usuário
 * Cria conta no Supabase com email e senha
 */
export async function signup(formData: FormData) {
	const supabase = await createClient();

	// Extrai e valida dados do formulário
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const nome = formData.get("nome") as string;
	const sobrenome = formData.get("sobrenome") as string;

	// Validação básica server-side
	if (!email || !password || !nome || !sobrenome) {
		console.error("Signup: Dados obrigatórios não fornecidos");
		redirect("/signup?error=missing-data");
	}

	// Cria nova conta no Supabase
	const { data: authData, error } = await supabase.auth.signUp({
		email: email.trim().toLowerCase(),
		password,
		options: {
			data: {
				nome: nome.trim(),
				sobrenome: sobrenome.trim(),
			},
		},
	});

	if (error) {
		console.error("Erro no signup:", error.message);

		// Redireciona com erro específico conforme PRD
		if (error.message.includes("User already registered")) {
			// Conforme PRD: "Já existe uma conta criada com este e-mail. Faça login para continuar."
			redirect("/login?error=email-exists");
		}

		if (error.message.includes("Password")) {
			redirect("/signup?error=weak-password");
		}

		redirect("/signup?error=auth-error");
	}

	if (!authData.user) {
		console.error("Signup: Usuário não retornado após criação");
		redirect("/signup?error=no-user");
	}

	// Criar perfil na tabela perfis
	const perfilData: PerfilInsert = {
		id: authData.user.id,
		nome: nome.trim(),
		sobrenome: sobrenome.trim(),
		email: email.trim().toLowerCase(),
		cargo: "admin", // Primeiro usuário é sempre admin do estabelecimento
		onboarding: false, // Precisa fazer onboarding
		estabelecimento_id: null, // Será definido no onboarding
	};

	const { error: profileError } = await supabase.from("perfis").insert(perfilData);

	if (profileError) {
		console.error("Erro ao criar perfil:", profileError);
		// Continua mesmo com erro no perfil, pois usuário foi criado
	}

	// Signup bem-sucedido - revalida cache e redireciona para onboarding
	revalidatePath("/", "layout");
	redirect("/onboarding");
}

/**
 * Server Action para fazer logout do usuário
 * Encerra sessão no Supabase e redireciona para login
 */
export async function signout() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	revalidatePath("/", "layout");
	redirect("/login");
}
