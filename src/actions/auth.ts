"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Server Action para fazer login do usuário
 * Processa dados do formulário e autentica via Supabase
 */
export async function login(formData: FormData) {
	const supabase = await createClient();

	// Extrai dados do formulário
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	// Tenta fazer login no Supabase
	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		redirect("/error");
	}

	// Revalida cache e redireciona para página inicial
	revalidatePath("/", "layout");
	redirect("/");
}

/**
 * Server Action para cadastrar novo usuário
 * Cria conta no Supabase com email e senha
 */
export async function signup(formData: FormData) {
	const supabase = await createClient();

	// Extrai dados do formulário
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	// Cria nova conta no Supabase
	const { error } = await supabase.auth.signUp(data);

	if (error) {
		redirect("/error");
	}

	// Revalida cache e redireciona para página inicial
	revalidatePath("/", "layout");
	redirect("/");
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
