import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * API Route para logout
 * Encerra sessão do usuário e redireciona para login
 */
export async function POST() {
	const supabase = await createClient();

	// Faz logout no Supabase
	await supabase.auth.signOut();

	// Revalida cache e redireciona
	revalidatePath("/", "layout");
	redirect("/login");
}
