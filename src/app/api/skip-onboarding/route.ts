import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * API Route temporária para pular onboarding
 * Remove quando onboarding real for implementado
 */
export async function POST() {
	const supabase = await createClient();

	// Verifica se usuário está autenticado
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL));
	}

	// Marca onboarding como completo
	const { error } = await supabase.from("perfis").update({ onboarding: true }).eq("id", user.id);

	if (error) {
		console.error("Erro ao atualizar onboarding:", error);
		return NextResponse.json({ error: "Erro interno" }, { status: 500 });
	}

	// Revalida cache e redireciona
	revalidatePath("/", "layout");
	redirect("/admin/dashboard");
}
